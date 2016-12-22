import React from 'react';
import Line from './Line';
import io from 'socket.io-client'
let socket = io(`http://localhost:3000`)

class LineIO extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        refresh: 1,
        x1: 100,
        y1: 100,
        x2: 200,
        y2: 200,
        event_msg: {}
    };

    this.setLine.bind(this)
    this.sendMessage.bind(this)
    this.receiveMessage.bind(this)

    socket.on('connect', function() {
      console.log("Client receives connect event"  );
      //this.receiveMessage("Connected server")
    })

    socket.on('serverevent', ev_msg => {
      console.log("Client receives server event:" + ev_msg );
      this.receiveMessage(ev_msg.message)
    })
  }

  sendMessage(message) {
    socket.emit('clientmessage', message)
  }

  receiveMessage(server_msg) {
    this.setState({event_msg : { message : server_msg }})
  }

  setLine(x1,y1,x2,y2) {
     if (this.state.refresh == 1) {
       this.setState({refresh: 1,x1: x1,y1: y1,x2: x2,y2: y2 })
     }
   }

  handleClick(e) {
    e.preventDefault();
    this.setLine(this.state.x1 ,this.state.y1 ,this.state.x2 + 20,this.state.y2 + 20)
    console.log("Client is sending message after click");
    this.sendMessage({ type : 'userMessage', message: 'This is an event from client to server after a click' } )
  }

  render() {

    return (
      <div className="Lineio">
      <a href="#" onClick={ (e) => this.handleClick(e) }>Click me</a>
      <h1>Message: {this.state.event_msg.message} </h1>
      <Line from={{x: this.state.x1, y: this.state.y2}} to={{x: this.state.x2, y: this.state.y2}} style="5px solid orange"/>
       </div>
    );
  }
}

//Use this code to pass socket to client
//<Child
//        socket = { socket }
//        sendMessage = { this.sendMessage }
//      />

LineIO.propTypes = {
    url: React.PropTypes.string  //Not yet used, at some point backend will be added
};

LineIO.defaultProps = {
    url: "http://localhost:3000/pandaweb/all"
};

export default LineIO;
