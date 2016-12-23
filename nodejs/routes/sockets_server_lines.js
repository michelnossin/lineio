var io = require('socket.io');

exports.initialize = function(server) {
  io = io.listen(server);
  var counter = 0

  //Send counter to all clients each second
  setInterval(function(){
    //socket.broadcast.emit('serverevent', {type : "servermessage", message : counter})
    io.sockets.emit('serverevent', {type : "servermessage", message : counter})
    counter = counter + 1
  }, 1 * 1000);

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
