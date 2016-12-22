var io = require('socket.io');

exports.initialize = function(server) {
  io = io.listen(server);


  io.sockets.on("connection", function(socket){
    console.log("Client is connected to server" );
    //socket.send(JSON.stringify(
    //            {type:'serverMessage',
    //             message: 'Server an see client connect'}));

    socket.on('clientmessage', function(message){
          console.log("received message from client : " + message.message );
          //message= JSON.parse(message);
          if(message.type == "userMessage"){
            console.log("The type of the event is a userMessage" );
            socket.emit('serverevent', {type : "servermessage", message : "The server says hi back"})
            socket.broadcast.emit('serverevent', {type : "servermessage", message : "Someone says hi to all"})
          }
        });
      });
}
