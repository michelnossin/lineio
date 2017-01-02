var io = require('socket.io');
var counter=0 //for timing purpose
var players = {}  //will contain current positions/speed/direction active players

//lets init our slots array. It will contain metadata like location to start, speed, direction etc.
var slots = []
let playfieldsize = 1000 //playfield is 1000x1000 (virtual)
var cnt=0

//Althoug we could add slots for many more users , for now keep it at 4 max.
var pos=100
//for (pos = 100; pos <= 400; pos = pos + 100) { //16 players nicely divided
slots.push({ slot: 0 + cnt, direction: "D", styling: "5px solid orange", x1: pos, y1 : pos, x2: pos, y2 : pos,speed : 1})
slots.push({ slot: 1 + cnt, direction: "U", styling: "5px solid yellow", x1: playfieldsize - pos, y1 : playfieldsize - pos, x2: playfieldsize - pos, y2 : playfieldsize - pos,speed : 1})
slots.push({ slot: 2 + cnt, direction: "L", styling: "5px solid blue",x1: playfieldsize - pos, y1 : pos, x2: playfieldsize - pos, y2 : pos,speed : 1})
slots.push({ slot: 3 + cnt, direction: "R", styling: "5px solid red",x1: pos, y1 : playfieldsize - pos, x2: pos, y2 : playfieldsize - pos,speed : 1})
cnt = cnt + 4
//}

//Start the socket server
exports.initialize = function(server) {
  io = io.listen(server);
  io.sockets.emit('serverevent', {type : "resetclients"})

  //Send positions to all players each 1/10 th of a second
  setInterval(function(){

    if (counter%100000 == 0) { //send all positions only once per 100 * 10ms = 1 sec
      console.log("Send server side positions on time: " + String(counter))
      io.sockets.emit('serverevent', {type : "positions", players: players })
    }

    //calculate new positions for all players based on speed and direction
    for (var player in players) {
      //console.log("player: " + JSON.stringify(player) );
      if (players[player].direction == "R") { players[player].x2 = players[player].x2 + players[player].speed }
      else if (players[player].direction == "L") { players[player].x2 = players[player].x2 - players[player].speed }
      else if (players[player].direction == "U") { players[player].y2 = players[player].y2 - players[player].speed }
      else if (players[player].direction == "D") { players[player].y2 = players[player].y2 + players[player].speed }
    };

    counter = counter + 1 //used as timer

  }, 10);  //10 ms loop (so 10* 1/1000th of a sec)

  //If a players leaves us lets remove it and let all know
  function removePlayer(socket) {
    for (var player in players) {
      console.log("Checking if player " + String(player) + " on socket " + String(players[player]["socketid"]) + " match our disconnected socket.")
      if (players[player]["socketid"] == socket.id) {
          console.log("Player " + String(player) + " using socket " + String(socket.id) + " will now be removed on the server" );
          delete players[player];
          socket.broadcast.emit('serverevent', {type : "removeUser", user: player})
      }
      else {
        console.log("Player does not match, checking next")
      }
    }
  }

  //This function will create a new user dictionary and determine properties like startposition, speed etc
  function initNewPlayer(newUser,socketId) {

    //Determine slot nr to use (the lowest free slot nr), and use it's slot metadata as properties for the new user
    //Max 4 players, maybe larger in the future
    for (slot = 0; slot <= 3; slot++) {
      var slotfound =0
      for (var player in players) {
        if (players[player].slot == slot) { slotfound = 1}
      }
      if (slotfound == 0) {
        console.log("slot nr " + slot + " is the lowest free slot, assigning to user " + newUser );
        var newPlayer = slots[slot]
        newPlayer["name"] = newUser
        newPlayer["socketid"] = socketId
        return newPlayer
      }
    }

    //let newplayer  = { name: newUser, direction: "R", x1: 100, y1 : 900, x2: 100, y2 : 900,speed : 1}
    console.log("All slots are taken allready, user cant play B:(" );
    return {}
  }


  //server receives connect event from client
  io.sockets.on("connection", function(socket){
    console.log("Client is connected to server using socket id " + String(socket.id) );
    //socket.emit('serverevent', {type : "resetGame"}) //After server restart clear all clients and demand client handshakes

    //USer is gone, remove from our list
    socket.on("disconnect",function(){
      console.log("At time " + counter + " the user has disconnected. Socket uses socket id: " + String(socket.id)  )
      removePlayer(socket)

    })

    //server receives custom event from client
    socket.on('clientmessage', function(message){
          if (message.type != "userCommand")
            console.log("At time " + counter + " , session on socket id: " + String(socket.id)  + " sends a events." )

          //A user sends a text message
          if(message.type == "userMessage"){
            console.log("The type of the event is a userMessage" );
            socket.emit('serverevent', {type : "servermessage", message : "The server says hi back"})
            socket.broadcast.emit('serverevent', {type : "servermessage", message : "Someone says hi to all"})
          }
          //A user pressed a key to control a line
          else if(message.type == "userCommand"){
            //console.log("At time " + counter + " the user " + message.user + " gives command : " + message.command);
            //console.log("line: " + JSON.stringify(message.line));

            if (players[message.user]) {

              //First let everybody know, also the sender, they need to add the ccurent line in the history array before we change its properties
              //io.sockets.emit('serverevent', {type : "addline", user: message.user, line : message.line , command: message.command })
              var split="-1"
              if (message.line.x1 < 500) {
                if (message.line.y1 < 500)
                  split="0"
                else
                  split="1"

              }
              else {
                if (message.line.y1 < 500)
                  split="2"
                else
                  split="3"
              }

              socket.broadcast.emit('serverevent', {type : "addline", user: message.user, line : message.line , command: message.command,split: split })
              socket.emit('serverevent', {type : "addline", user: message.user, line : message.line , command: message.command,split: split })

              //Switch direction of user, and start the new line at end location of previous line.
              players[message.user].direction = message.command
              players[message.user].x1 = message.line.x2
              players[message.user].x2 = message.line.x2
              players[message.user].y1 = message.line.y2
              players[message.user].y2 = message.line.y2
            }
          }
          //After initial connect this will let the new user know its properties, were to start etc.
          else if(message.type == "userHandshake"){
            console.log("At time " + counter + " the user " + message.user + " wants to play. Adding to slot and reply with handshake");
            newplayer = initNewPlayer(message.user,socket.id)
            socket.emit('serverevent', {type : "serverHandshake", user: newplayer})
            players[message.user] = newplayer
            console.log("Lets send all players and position to all users so they know each other")
            //io.sockets.emit('serverevent', {type : "positions", players: players })
            socket.broadcast.emit('serverevent', {type : "positions", players: players })
            socket.emit('serverevent', {type : "positions", players: players })

          }

        });

  });
}
