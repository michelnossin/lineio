'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Line = require('./Line');

var _Line2 = _interopRequireDefault(_Line);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _reactKeydown = require('react-keydown');

var _reactKeydown2 = _interopRequireDefault(_reactKeydown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var socket = (0, _socket2.default)('http://192.168.0.105:3000'); //our server 192.168.0.105
var user = "user_" + Math.random().toString(36).substring(7); //Lets give the user a name, todo: let the user make this up
console.log("Client is using this name: " + user);

var LineIO = (0, _reactKeydown2.default)(_class = function (_React$Component) {
  _inherits(LineIO, _React$Component);

  function LineIO(props) {
    _classCallCheck(this, LineIO);

    var _this = _possibleConstructorReturn(this, (LineIO.__proto__ || Object.getPrototypeOf(LineIO)).call(this, props));

    var dict = {};
    //dict[user] = {x1:0,y1:0,x2:0,y2:0}
    //dict[user] = {x1:0,y1:0,x2:0,y2:0}

    _this.state = {
      event_msg: {}, //message from server
      position: dict,
      key: 'n/a', //key pressed
      lines: [] //list of all non current lines
    };

    //this.isConnected = 0
    _this.sendMessage = _this.sendMessage.bind(_this);
    _this.receiveMessage = _this.receiveMessage.bind(_this);
    _this.receivePositions = _this.receivePositions.bind(_this);
    _this.addLine = _this.addLine.bind(_this);
    _this.autoKeyPress = _this.autoKeyPress.bind(_this);
    _this.resetClient = _this.resetClient.bind(_this);
    _this.myLoop = _this.myLoop.bind(_this);

    //receive event from server
    socket.on('serverevent', function (ev_msg) {
      //console.log("Client receives server event type " + ev_msg.type  );
      if (ev_msg.type == 'servermessage') {
        //Some user send a text message.
        _this.receiveMessage(ev_msg.message);
      }
      //each short period we will get all latest positions of all users
      else if (ev_msg.type == 'positions') {
          console.log("Client received all player locations");
          _this.receivePositions(ev_msg.players);
        }
        //Init client based on server properties as determined
        else if (ev_msg.type == 'serverHandshake') {
            //this.resetClient()
            console.log("Server handshake received by client");
            var dict = {};
            dict[user] = ev_msg.user;
            _this.setState({ position: dict });
          }
          //If a user switched line by pressing a cursor key the line has to be added to the lines hstory array so these also will render
          else if (ev_msg.type == 'addline') {
              _this.addLine(ev_msg.user, ev_msg.command, ev_msg.line);
            } else if (ev_msg.type == 'resetclients') {
              console.log("Client resetting after server request");
              _this.resetClient();
            } else if (ev_msg.type == 'removeUser') {
              console.log("Another user named " + ev_msg.user + " is gone, lets remove this user");
              var positions = {};
              positions = Object.assign({}, _this.state.position);
              delete positions[ev_msg.user];
              _this.setState({ position: positions });
            }
    });

    return _this;
  }

  //shouldComponentUpdate(nextProps, nextState) {
  //  return false;
  //}

  //Send positions to all players each 1/10 th of a second


  _createClass(LineIO, [{
    key: 'myLoop',
    value: function myLoop() {
      //calculate new positions for all players based on speed and direction
      var positions = {};
      positions = Object.assign({}, this.state.position);

      Object.keys(positions).map(function (player, index) {
        if (positions[player].direction == "R") {
          positions[player].x2 = positions[player].x2 + positions[player].speed;
        } else if (positions[player].direction == "L") {
          positions[player].x2 = positions[player].x2 - positions[player].speed;
        } else if (positions[player].direction == "U") {
          positions[player].y2 = positions[player].y2 - positions[player].speed;
        } else if (positions[player].direction == "D") {
          positions[player].y2 = positions[player].y2 + positions[player].speed;
        }
      });

      this.setState({ position: positions });
      //this.forceUpdate()
    }

    //reset client after connect

  }, {
    key: 'resetClient',
    value: function resetClient() {
      //Clear everything after server restart
      var dict = {};
      //dict[user] = {x1:0,y1:0,x2:0,y2:0}
      this.setState({
        event_msg: {}, //message from server
        position: dict,
        key: 'n/a', //key pressed
        lines: [] //list of all non current lines
      });
      this.forceUpdate();
    }

    //Generate random control command, handy for simulation of multipley players.

  }, {
    key: 'autoKeyPress',
    value: function autoKeyPress() {
      var w = window.innerWidth;
      var h = window.innerHeight;

      var textArray = ["D", "U", "R", "L"];
      var randomNumber = Math.floor(Math.random() * textArray.length);
      var keypress = textArray[randomNumber];
      //let oldDirection = Object.assign(this.state.position[user].direction)
      var oldDirection = this.state.position[user].direction;

      //Stear away from the screen borders
      if (this.state.position[user].x2 < w * 0.25) {
        if (oldDirection != "L") keypress = "R";else keypress = "D";
      } else if (this.state.position[user].y2 < h * 0.25) {
        if (oldDirection != "U") keypress = "D";else keypress = "R";
      } else if (this.state.position[user].x2 > w * 0.75) {
        if (oldDirection != "R") keypress = "L";else keypress = "U";
        //console.log("sending left cmd to correct width " + this.state.position[user].x2 );
      } else if (this.state.position[user].y2 > h * 0.75) {
        if (oldDirection != "D") keypress = "U";else keypress = "R";
        //console.log("sending UP cmd to correct height " + this.state.position[user].y2 );
      }

      //Do not go in opposite direction (180 turn)
      if (oldDirection == "R" && keypress == "L") keypress = "D";else if (oldDirection == "L" && keypress == "R") keypress = "U";else if (oldDirection == "U" && keypress == "D") keypress = "R";else if (oldDirection == "D" && keypress == "U") keypress = "L";

      //Normalise locations to they fit our 1000x1000 virtual grid
      var liny = Object.assign({}, this.state.position[user]);
      liny.x1 = liny.x1 / w * 1000;
      liny.x2 = liny.x2 / w * 1000;
      liny.y1 = liny.y1 / h * 1000;
      liny.y2 = liny.y2 / h * 1000;

      socket.emit('clientmessage', { type: "userCommand", user: user, command: keypress, line: liny });
    }

    //client set timer, at this moment only used to simulate key events

  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.timerPosition = setInterval(this.myLoop, 5); //will move the active player lines
      this.timer = setInterval(this.autoKeyPress, 500); //2 second random movement by clicking some cursor keys

      var self = this;
      socket.on('connect', function (data) {
        console.log("Client receives connect event, clearing client");
        self.resetClient();
        console.log("Client sends handshake to server with username " + user);
        socket.emit('clientmessage', { type: "userHandshake", user: user });
      });
      socket.on('disconnect', function () {
        console.log("Client was disconnected , clearing client");
        self.resetClient();
      });
    }

    //Stop timers afterwards

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      console.log("Client with name " + user + " was disconnected , clearing client");
      clearInterval(this.timerPosition);
      clearInterval(this.timer);
      socket.emit('clientmessage', { type: "removeUser", user: user });
    }

    //keypress reveived to, eg , change the direction of our line

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var w = window.innerWidth;
      var h = window.innerHeight;

      var event = nextProps.keydown.event;

      if (event) {

        //Change direction after cursor press //, line: this.state.position[user]
        if (event.which == 37) {
          if (this.state.position[user].direction == "L") return; //prevent sending events if keys is being pressed continu
          var liny = Object.assign({}, this.state.position[user]);

          liny.x1 = liny.x1 / w * 1000;
          liny.x2 = liny.x2 / w * 1000;
          liny.y1 = liny.y1 / h * 1000;
          liny.y2 = liny.y2 / h * 1000;

          this.sendMessage({ type: "userCommand", user: user, command: "L", line: liny });
        }
        if (event.which == 38) {
          if (this.state.position[user].direction == "U") return;
          var liny = Object.assign({}, this.state.position[user]);
          liny.x1 = liny.x1 / w * 1000;
          liny.x2 = liny.x2 / w * 1000;
          liny.y1 = liny.y1 / h * 1000;
          liny.y2 = liny.y2 / h * 1000;
          this.sendMessage({ type: "userCommand", user: user, command: "U", line: liny });
        }
        if (event.which == 39) {
          if (this.state.position[user].direction == "R") return;
          var liny = Object.assign({}, this.state.position[user]);
          liny.x1 = liny.x1 / w * 1000;
          liny.x2 = liny.x2 / w * 1000;
          liny.y1 = liny.y1 / h * 1000;
          liny.y2 = liny.y2 / h * 1000;
          this.sendMessage({ type: "userCommand", user: user, command: "R", line: liny });
        }
        if (event.which == 40) {
          if (this.state.position[user].direction == "D") return;
          var liny = Object.assign({}, this.state.position[user]);
          liny.x1 = liny.x1 / w * 1000;
          liny.x2 = liny.x2 / w * 1000;
          liny.y1 = liny.y1 / h * 1000;
          liny.y2 = liny.y2 / h * 1000;
          this.sendMessage({ type: "userCommand", user: user, command: "D", line: liny });
        }
      }
    }

    //Add line is an event received marking the end of the last active line for a user
    //In linehistory that will just paint the old line. In lineIo (so here) it will change the direction and location of the active line for that user

  }, {
    key: 'addLine',
    value: function addLine(userTrigger, command, line) {
      //console.log("addline: " + JSON.stringify(userTrigger)  + " command " + JSON.stringify(command) +  " line " + JSON.stringify(line));
      var position = Object.assign({}, this.state.position);
      var w = window.innerWidth;
      var h = window.innerHeight;

      position[userTrigger].x1 = w / 1000 * line.x2;
      position[userTrigger].x2 = w / 1000 * line.x2;
      position[userTrigger].y1 = h / 1000 * line.y2;
      //console.log("y1 position changed by addline " + JSON.stringify(position[userTrigger].y1) + " for user " + JSON.stringify(userTrigger) + " for slot " + JSON.stringify(line.slot))
      position[userTrigger].y2 = h / 1000 * line.y2;

      //position[userTrigger].x1 = position[userTrigger].x2
      //position[userTrigger].y1 = position[userTrigger].y2

      position[userTrigger].direction = command;

      //if (userTrigger != user)
      //  console.log("add line postion: " + JSON.stringify(position[userTrigger] ))

      this.setState({
        position: position });
    }

    //Send event message to server, for example to let others know we change our line direction

  }, {
    key: 'sendMessage',
    value: function sendMessage(message) {
      socket.emit('clientmessage', message);
    }

    //We received event with real text message from server, for example send chat message (in the future to build)

  }, {
    key: 'receiveMessage',
    value: function receiveMessage(server_msg) {
      this.setState({ event_msg: { message: server_msg } });
    }

    //We receive position of all player lines each .. period from the server to correct any difference calculated on the clients

  }, {
    key: 'receivePositions',
    value: function receivePositions(positions) {
      var _this2 = this;

      console.log("received server positions for all players");

      var w = window.innerWidth;
      var h = window.innerHeight;

      Object.keys(positions).map(function (username, index) {
        //Positions are based on a 1000x1000 blocks virtual field, translate to real window size
        positions[username]["x1"] = w / 1000 * positions[username].x1;
        positions[username]["y1"] = h / 1000 * positions[username].y1;
        positions[username]["x2"] = w / 1000 * positions[username].x2;
        positions[username]["y2"] = h / 1000 * positions[username].y2;

        _this2.setState({ position: positions });
        //this.forceUpdate()
      });
    }

    //Click on element handling, not used at this moment

  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      e.preventDefault();
      this.sendMessage({ type: 'userMessage', message: 'This is an event from client to server after a click' });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var username = "";

      return _react2.default.createElement(
        'div',
        { className: 'Lineio' },
        Object.keys(this.state.position).map(function (username, index) {
          return _react2.default.createElement(_Line2.default, { key: index,
            from: { x: _this3.state.position[username].x1, y: _this3.state.position[username].y1 },
            to: { x: _this3.state.position[username].x2, y: _this3.state.position[username].y2 }, style: _this3.state.position[username].styling });
        }),
        _react2.default.createElement(
          'footer',
          null,
          this.state.event_msg.message
        )
      );
    }
  }]);

  return LineIO;
}(_react2.default.Component)) || _class;

LineIO.propTypes = {
  url: _react2.default.PropTypes.string };

LineIO.defaultProps = {
  url: "http://localhost:3000/pandaweb/all"
};

exports.default = LineIO;