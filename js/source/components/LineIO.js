import React from 'react';
import Line from './Line';
import io from 'socket.io-client'
import keydown from 'react-keydown';
let socket = io(`http://192.168.0.102:3000`) //our server
let user = "user_" + Math.random().toString(36).substring(7); //Lets give the user a name, todo: let the user make this up
console.log("Client is using this name: " + user  );

@keydown
class LineIO extends React.Component {

  constructor(props) {
    super(props);

    var dict = {}
    dict[user] = {x1:0,y1:0,x2:0,y2:0}

    this.state = {
        event_msg: {}, //message from server
        position: dict,
        key: 'n/a', //key pressed
        lines : []  //list of all non current lines
    };

    this.sendMessage = this.sendMessage.bind(this)
    this.receiveMessage = this.receiveMessage.bind(this)
    this.receivePositions = this.receivePositions.bind(this)
    this.addLine = this.addLine.bind(this)
    this.autoKeyPress = this.autoKeyPress.bind(this)
    this.resetClient = this.resetClient.bind(this)

    //received connect from server, this will trigger a handshake from our client by saying our name
    socket.on('connect', function() {
      console.log("Client receives connect event"  );
      console.log("Client sends handshake to server with username " + user  );
      socket.emit('clientmessage', { type: "userHandshake", user: user })
    })

    //receive event from server
    socket.on('serverevent', ev_msg => {
      //console.log("Client receives server event type " + ev_msg.type  );
      if (ev_msg.type == 'servermessage') {
        //Some user send a text message.
        this.receiveMessage(ev_msg.message)
      }
      //each short period we will get all latest positions of all users
      else if (ev_msg.type == 'positions') {
        this.receivePositions(ev_msg.players)
       }
      //Init client based on server properties as determined
      else if (ev_msg.type == 'serverHandshake') {
        this.resetClient()
        var dict = {}
        dict[user] = ev_msg.user
        this.setState( { position: dict })
      }
      //If a user switched line by pressing a cursor key the line has to be added to the lines hstory array so these also will render
      else if (ev_msg.type == 'addline') {
          this.addLine(ev_msg.line)
      }
    })
  }

  //reset client after connect
  resetClient() {
    //Clear everything after server restart
    var dict = {}
    dict[user] = {x1:0,y1:0,x2:0,y2:0}
    this.setState({
      event_msg: {}, //message from server
      position: dict,
      key: 'n/a', //key pressed
      lines : []  //list of all non current lines
    });

  }

  //Generate random control command, handy for simulation of multipley players.
  autoKeyPress() {
    let w = window.innerWidth
    let h = window.innerHeight

    var textArray = ["D","U","R","L"];
    var randomNumber = Math.floor(Math.random()*textArray.length);
    var keypress = textArray[randomNumber]
    let oldDirection = this.state.position[user].direction

    if (this.state.position[user].x2 < w*0.25 ) {
      if (oldDirection != "L")
        keypress = "R"
      else
        keypress = "D"
    }
    else if (this.state.position[user].y2 < h*0.25 ) {
      if (oldDirection != "U")
        keypress = "D"
      else keypress = "R"
    }
    else if (this.state.position[user].x2 > w*0.75 ) {
      if (oldDirection != "R")
        keypress = "L"
      else
        keypress = "U"
      console.log("sending left cmd to correct width " + this.state.position[user].x2 );
    }
    else if (this.state.position[user].y2 > h*0.75) {
      if (oldDirection != "D")
        keypress = "U"
      else
        keypress = "R"
      console.log("sending UP cmd to correct height " + this.state.position[user].y2 );
    }

    if (oldDirection == "R"  && keypress == "L")
        keypress = "D"
    else if (oldDirection == "L"  && keypress == "R")
        keypress = "U"
    else if (oldDirection == "U"  && keypress == "D")
        keypress = "R"
    else if (oldDirection == "D"  && keypress == "U")
        keypress = "L"

    socket.emit('clientmessage', {type : "userCommand", user: user, command : keypress })
  }

  //client set timer, at this moment only used to simulate key events
  componentDidMount()  {
    this.timer = setInterval(this.autoKeyPress, 2000); //1 second random movement
  }

  //keypress reveived to, eg , change the direction of our line
  componentWillReceiveProps( nextProps ) {
    //let w = window.innerWidth
    //let h = window.innerHeight

    const { keydown: { event } } = nextProps;
    if ( event ) {

      //Change direction after cursor press //, line: this.state.position[user]
      if (event.which == 37) {
        if (this.state.position[user].direction == "L") return; //prevent sending events if keys is being pressed continu
        this.sendMessage({type : "userCommand", user: user, command :"L" })
      }
      if (event.which == 38) {
        if (this.state.position[user].direction == "U") return;
        this.sendMessage({type : "userCommand", user: user, command : "U" })
      }
      if (event.which == 39) {
        if (this.state.position[user].direction == "R") return;
        this.sendMessage({type : "userCommand", user: user, command : "R" })
       }
      if (event.which == 40) {
        if (this.state.position[user].direction == "D") return;
        this.sendMessage({type : "userCommand", user: user, command : "D" })
       }

    }
  }

  //Add line to our history, triggered after keypress/change of direction of line
  addLine(username) {
      //this.setState({
        //lines: this.state.lines.concat(this.state.position[username])

      //});
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
    let w = window.innerWidth
    let h = window.innerHeight

    Object.keys(positions).map((username,index) => {
      //Positions are based on a 1000x1000 blocks virtual field, translate to real window size
      positions[username]["x1"] = (w/1000) * positions[username].x1
      positions[username]["y1"] = (h/1000) * positions[username].y1
      positions[username]["x2"] = (w/1000) * positions[username].x2
      positions[username]["y2"] = (h/1000) * positions[username].y2

      //console.log("active line at pos" + JSON.stringify(positions ));
      this.setState( { position: positions })
      //this.forceUpdate()
    })
  }

  //Click on element handling, not used at this moment
  handleClick(e) {
    e.preventDefault();
    this.sendMessage({ type : 'userMessage', message: 'This is an event from client to server after a click' } )
  }

  render() {
    var username=""

    return (
      <div className="Lineio" >
      { Object.keys(this.state.position).map((username,index) => (
      <Line key={index}
      from={{x: this.state.position[username].x1, y: this.state.position[username].y1}}
      to={{x: this.state.position[username].x2, y: this.state.position[username].y2}} style={this.state.position[username].styling}/>
    ))}
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
