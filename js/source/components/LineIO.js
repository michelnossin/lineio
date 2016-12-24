import React from 'react';
import Line from './Line';
import io from 'socket.io-client'
import keydown from 'react-keydown';
let socket = io(`http://localhost:3000`) //our server

@keydown
class LineIO extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        event_msg: {}, //message from server
        event_pos: { userA : {x1:0,y1:0,x2:0,y2:0} , userB : {x1:0,y1:0,x2:0,y2:0}},  //All player positions
        key: 'n/a', //key pressed
        lines : []  //list of all non current lines
    };

    this.sendMessage.bind(this)
    this.receiveMessage.bind(this)
    this.receivePositions.bind(this)
    this.addLine.bind(this)

    //received connect from server
    socket.on('connect', function() {
      console.log("Client receives connect event"  );
    })

    //receive event from server
    socket.on('serverevent', ev_msg => {
      if (ev_msg.type == 'servermessage') { this.receiveMessage(ev_msg.message)  }
      if (ev_msg.type == 'positions') { this.receivePositions(ev_msg.players) }
    })
  }

  //keypress reveived to, eg , change the direction of our line
  componentWillReceiveProps( nextProps ) {
    const { keydown: { event } } = nextProps;
    if ( event ) {
      this.setState( { key: event.which } );
      //Change direction after cursor press
      if (event.which == 37) { this.sendMessage({type : "userCommand", user: "userA" , command :"L"}) }
      if (event.which == 38) { this.sendMessage({type : "userCommand", user: "userA", command : "U"})  }
      if (event.which == 39) { this.sendMessage({type : "userCommand", user: "userA", command : "R"})  }
      if (event.which == 40) { this.sendMessage({type : "userCommand", user: "userA", command : "D"})  }
      //if (event.which in [37,38,39,40] ) { this.addLine(this.state.event_pos) }  //save current line to history
      this.addLine(this.state.event_pos)
    }
  }

  //Add line to our history, triggered after keypress/change of direction of line
  addLine(line) {
      // State change will cause component re-render

      //Current endpoint will become new begin point
      let newx = this.state.event_pos.userA.x2
      let newy = this.state.event_pos.userA.y2
      let userB = this.state.event_pos.userB

      this.setState({
        lines : this.state.lines.concat([{line: line}]),
        event_pos: { userA : {x1: newx, y1: newy, x2 : newx, y2 : newy}, userB : userB }
      })

    }

  //Send event message to server, for example to let others know we change our line direction
  sendMessage(message) {
    socket.emit('clientmessage', message)
  }

  //We received event with real text message from server, for example send chat message (in the future to build)
  receiveMessage(server_msg) {
    this.setState({event_msg : { message : server_msg }})
  }

  //We receive position of all player lines each .. period
  receivePositions(positions) {

    let w = window.innerWidth //Positions are based on a 1000x1000 blocks virtual field, translate to real window size
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

  //Click on element handling, not used at this moment
  handleClick(e) {
    e.preventDefault();
    //console.log("Client is sending message after click");
    this.sendMessage({ type : 'userMessage', message: 'This is an event from client to server after a click' } )
  }

  //Render our game initially with 2 players each having 1 line
  render() {
    return (
      <div className="Lineio" >
      { this.state.lines.map((item,index) => (
        <Line
        key={index}
        from={{x: item.line.userA.x1, y: item.line.userA.y1}}
        to={{x: item.line.userA.x2, y: item.line.userA.y2}} style="5px solid orange"/>
      )) }
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

LineIO.propTypes = {
    url: React.PropTypes.string,  //Not yet used, at some point backend will be added
};

LineIO.defaultProps = {
    url: "http://localhost:3000/pandaweb/all",
};

export default LineIO;


//Below just some temporary code we might be needed later. To remove sometime:
//{this.state.lines.map((item,index) => (<h1 key={index}>{item.command}</h1> )) }

//this.state.map((item) => (
//                        <SampleComponent key={item.id} name={item.name}/>
//                    ))

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
