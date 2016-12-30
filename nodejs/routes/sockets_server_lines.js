var io = require('socket.io');
var counter=0 //for timing purpose
var players = {}  //will contain current positions/speed/direction active players

//lets init our slots array. It will contain metadata like location to start, speed, direction etc.
var slots = []
let playfieldsize = 1000 //playfield is 1000x1000 (virtual)
var cnt=0
for (pos = 100; pos <= 400; pos = pos + 100) { //16 players nicely divided
    slots.push({ slot: 0 + cnt, direction: "D", styling: "5px solid orange", x1: pos, y1 : pos, x2: pos, y2 : pos,speed : 1})
    slots.push({ slot: 1 + cnt, direction: "U", styling: "5px solid yellow", x1: playfieldsize - pos, y1 : playfieldsize - pos, x2: playfieldsize - pos, y2 : playfieldsize - pos,speed : 1})
    slots.push({ slot: 2 + cnt, direction: "L", styling: "5px solid blue",x1: playfieldsize - pos, y1 : pos, x2: playfieldsize - pos, y2 : pos,speed : 1})
    slots.push({ slot: 3 + cnt, direction: "R", styling: "5px solid red",x1: pos, y1 : playfieldsize - pos, x2: pos, y2 : playfieldsize - pos,speed : 1})
    cnt = cnt + 4
}

//Start the socket server
exports.initialize = function(server) {
  io = io.listen(server);

  //Send positions to all players each 1/10 th of a second
  setInterval(function(){
    io.sockets.emit('serverevent', {type : "positions", players: players })

    //calculate new positions for all players based on speed and direction
    for (var player in players) {
      //console.log("player: " + JSON.stringify(player) );
      if (players[player].direction == "R") { players[player].x2 = players[player].x2 + players[player].speed }
      else if (players[player].direction == "L") { players[player].x2 = players[player].x2 - players[player].speed }
      else if (players[player].direction == "U") { players[player].y2 = players[player].y2 - players[player].speed }
      else if (players[player].direction == "D") { players[player].y2 = players[player].y2 + players[player].speed }
    };

    counter = counter + 1 //used as timer

  }, 20);

  //This function will create a new user dictionary and determine properties like startposition, speed etc
  function initNewPlayer(newUser) {

    //Determine slot nr to use (the lowest free slot nr), and use it's slot metadata as properties for the new user
    for (slot = 0; slot <= 15; slot++) {
      var slotfound =0
      for (var player in players) {
        if (players[player].slot == slot) { slotfound = 1}
      }
      if (slotfound == 0) {
        console.log("slot nr " + slot + " is the lowest free slot, assigning to user " + newUser );
        var newPlayer = slots[slot]
        newPlayer["name"] = newUser
        return newPlayer
      }
    }

    //let newplayer  = { name: newUser, direction: "R", x1: 100, y1 : 900, x2: 100, y2 : 900,speed : 1}
    console.log("All slots are taken allready, user cant play B:(" );
    return {}
  }

  //server receives connect event from client
  io.sockets.on("connection", function(socket){
    console.log("Client is connected to server," );
    //socket.emit('serverevent', {type : "resetGame"}) //After server restart clear all clients and demand client handshakes

    //server receives custom event from client
    socket.on('clientmessage', function(message){

          //A user sends a text message
          if(message.type == "userMessage"){
            console.log("The type of the event is a userMessage" );
            socket.emit('serverevent', {type : "servermessage", message : "The server says hi back"})
            socket.broadcast.emit('serverevent', {type : "servermessage", message : "Someone says hi to all"})
          }
          //A user pressed a key to control a line
          else if(message.type == "userCommand"){
            console.log("At time " + counter + " the user " + message.user + " gives command : " + message.command);

            if (players[message.user]) {
              //First let everybody know, also the sender, they need to add the ccurent line in the history array before we change its properties
              io.sockets.emit('serverevent', {type : "addline", user: message.user, line : players[message.user] })

              //Switch direction of user, and start the new line at end location of previous line.
              players[message.user].direction = message.command
              players[message.user].x1 = players[message.user].x2
              players[message.user].y1 = players[message.user].y2
            }
          }
          //After initial connect this will let the new user know its properties, were to start etc.
          else if(message.type == "userHandshake"){
            console.log("At time " + counter + " the user " + message.user + " wants to play. Adding to slot and reply with handshake");
            newplayer = initNewPlayer(message.user)
            socket.emit('serverevent', {type : "serverHandshake", user: newplayer})
            players[message.user] = newplayer
          }
        });

  });
}
