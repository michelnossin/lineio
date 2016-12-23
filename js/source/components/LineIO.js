import React from 'react';
import Line from './Line';
import io from 'socket.io-client'
let socket = io(`http://localhost:3000`)

class LineIO extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        event_msg: {}, //message from server
        event_pos: { userA : {x1:0,y1:0,x2:0,y2:0} , userB : {x1:0,y1:0,x2:0,y2:0}},  //All player positions
        key: 'n/a'
    };

    this.sendMessage.bind(this)
    this.receiveMessage.bind(this)
    this.receivePositions.bind(this)

    socket.on('connect', function() {
      console.log("Client receives connect event"  );
    })

    socket.on('serverevent', ev_msg => {
      //console.log("Client receives server event:" + ev_msg );
      if (ev_msg.type == 'servermessage') {
        this.receiveMessage(ev_msg.message) //chat message
      }
      if (ev_msg.type == 'positions') {
        this.receivePositions(ev_msg.players) //position players
      }

    })
  }

  sendMessage(message) {
    socket.emit('clientmessage', message)
  }

  receiveMessage(server_msg) {
    this.setState({event_msg : { message : server_msg }})
  }

  receivePositions(positions) {

    let w = window.innerWidth
    let h = window.innerHeight
    let p1x1 = (w/1000) * positions.userA.x1
    let p1y1 = (h/1000) * positions.userA.y1
    let p1x2 = (w/1000) * positions.userA.x2
    let p1y2 = (h/1000) * positions.userA.y2
    //if (p1x2 < p1x1) { [p1x1, p1x2] = [p1x2, p1x1];}

    let p2x1 = (w/1000) * positions.userB.x1
    let p2y1 = (h/1000) * positions.userB.y1
    let p2x2 = (w/1000) * positions.userB.x2
    let p2y2 = (h/1000) * positions.userB.y2
    //if (p2x2 < p2x1) { [p2x1, p2x2] = [p2x2, p2x1];}

    this.setState( {event_pos: { userA : {x1:p1x1,y1:p1y1,x2:p1x2,y2:p1y2} , userB : {x1:p2x1,y1:p2y1,x2:p2x2,y2:p2y2}}})
  }

  handleClick(e) {
    e.preventDefault();
    //console.log("Client is sending message after click");
    this.sendMessage({ type : 'userMessage', message: 'This is an event from client to server after a click' } )
  }

  render() {

    return (
      <div className="Lineio" >
      <Line
      from={{x: this.state.event_pos.userA.x1, y: this.state.event_pos.userA.y1}}
      to={{x: this.state.event_pos.userA.x2, y: this.state.event_pos.userA.y2}} style="5px solid orange"/>
      <Line
      from={{x: this.state.event_pos.userB.x1, y: this.state.event_pos.userB.y1}}
      to={{x: this.state.event_pos.userB.x2, y: this.state.event_pos.userB.y2}} style="5px solid red"/>
      <footer>{this.state.event_msg.message}</footer>
       </div>
    );
  }
}

//This works, removing later
//<div className="Lineio">
//<a href="#" onClick={ (e) => this.handleClick(e) }>Click me</a>
//<h1>Message: {this.state.event_msg.message} </h1>
//<Line from={{x: this.state.x1, y: this.state.y2}} to={{x: this.state.x2, y: this.state.y2}} style="5px solid orange"/>
// </div>


//Use this code to pass socket to client
//<Child
//        socket = { socket }
//        sendMessage = { this.sendMessage }
//      />

LineIO.propTypes = {
    url: React.PropTypes.string,  //Not yet used, at some point backend will be added
};

LineIO.defaultProps = {
    url: "http://localhost:3000/pandaweb/all",
};

export default LineIO;
