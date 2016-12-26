var io = require('socket.io');
var counter=0
var players = {}

exports.initialize = function(server) {
  io = io.listen(server);

  //Send positions each 1/10 th of a second
  setInterval(function(){
    //console.log("players:" + JSON.stringify(players) );
    io.sockets.emit('serverevent', {type : "positions", players: players })

    //loop through players and calculate new positions
    for (var player in players) {
      //console.log("player: " + JSON.stringify(player) );
      if (players[player].direction == "R") { players[player].x2 = players[player].x2 + players[player].speed }
      else if (players[player].direction == "L") { players[player].x2 = players[player].x2 - players[player].speed }
      else if (players[player].direction == "U") { players[player].y2 = players[player].y2 - players[player].speed }
      else if (players[player].direction == "D") { players[player].y2 = players[player].y2 + players[player].speed }
    };

    counter = counter + 1 //used as timer

  }, 10);

  //server receives connect event from client
  io.sockets.on("connection", function(socket){
    console.log("Client is connected to server" );

    //server receives custom event from client
    socket.on('clientmessage', function(message){
          //console.log("received message from client : " + message.message );

          if(message.type == "userMessage"){
            console.log("The type of the event is a userMessage" );
            socket.emit('serverevent', {type : "servermessage", message : "The server says hi back"})
            socket.broadcast.emit('serverevent', {type : "servermessage", message : "Someone says hi to all"})
          }
          else if(message.type == "userCommand"){
            console.log("At time " + counter + " the user " + message.user + " gives command : " + message.command);

            //Switch direction of user
            players[message.user].direction = message.command
            players[message.user].x1 = players[message.user].x2
            players[message.user].y1 = players[message.user].y2
          }
          else if(message.type == "userHandshake"){
            console.log("At time " + counter + " the user " + message.user + " wants to play");
            newplayer = { name: message.user, direction: "R", x1: 100, y1 : 900, x2: 100, y2 : 900,speed : 1}
            console.log("adding user " + newplayer.name);
            players[message.user] = newplayer
          }
        });

  });
}
