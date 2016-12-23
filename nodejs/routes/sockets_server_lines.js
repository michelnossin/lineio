var io = require('socket.io');

exports.initialize = function(server) {
  io = io.listen(server);

  userA = {name: "userA", direction: "R", x1: 100, y1 : 900, x2: 100, y2 : 900,speed : 1}
  userB = {name: "userB", direction: "L", x1: 900, y1 : 100, x2: 900, y2 : 100,speed : 1}
  players = {userA : userA, userB : userB}

  //Send positions each 1/10 th of a second
  setInterval(function(){
    io.sockets.emit('serverevent', {type : "positions", players: players })

    userA.x2 = userA.x2 + 1
    userB.x2 = userB.x2 - 1

  }, 20);

  //server receives connect event from client
  io.sockets.on("connection", function(socket){
    console.log("Client is connected to server" );

    //server receives custom event from client
    socket.on('clientmessage', function(message){
          console.log("received message from client : " + message.message );

          if(message.type == "userMessage"){
            console.log("The type of the event is a userMessage" );
            socket.emit('serverevent', {type : "servermessage", message : "The server says hi back"})
            socket.broadcast.emit('serverevent', {type : "servermessage", message : "Someone says hi to all"})
          }
        });

  });
}
