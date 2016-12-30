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

var socket = (0, _socket2.default)('http://localhost:3000'); //our server
var user = "user_" + Math.random().toString(36).substring(7); //Lets give the user a name, todo: let the user make this up
console.log("Client is using this name: " + user);

var LineIO = (0, _reactKeydown2.default)(_class = function (_React$Component) {
  _inherits(LineIO, _React$Component);

  function LineIO(props) {
    _classCallCheck(this, LineIO);

    var _this = _possibleConstructorReturn(this, (LineIO.__proto__ || Object.getPrototypeOf(LineIO)).call(this, props));

    var dict = {};
    dict[user] = { x1: 0, y1: 0, x2: 0, y2: 0 };

    _this.state = {
      event_msg: {}, //message from server
      position: dict,
      key: 'n/a', //key pressed
      lines: [] //list of all non current lines
    };

    _this.sendMessage = _this.sendMessage.bind(_this);
    _this.receiveMessage = _this.receiveMessage.bind(_this);
    _this.receivePositions = _this.receivePositions.bind(_this);
    _this.addLine = _this.addLine.bind(_this);
    _this.autoKeyPress = _this.autoKeyPress.bind(_this);
    _this.resetClient = _this.resetClient.bind(_this);

    //received connect from server, this will trigger a handshake from our client by saying our name
    socket.on('connect', function () {
      console.log("Client receives connect event");
      console.log("Client sends handshake to server with username " + user);
      socket.emit('clientmessage', { type: "userHandshake", user: user });
    });

    //receive event from server
    socket.on('serverevent', function (ev_msg) {
      //console.log("Client receives server event type " + ev_msg.type  );
      if (ev_msg.type == 'servermessage') {
        //Some user send a text message.
        _this.receiveMessage(ev_msg.message);
      }
      //each short period we will get all latest positions of all users
      else if (ev_msg.type == 'positions') {
          _this.receivePositions(ev_msg.players);
        }
        //Init client based on server properties as determined
        else if (ev_msg.type == 'serverHandshake') {
            _this.resetClient();
            var dict = {};
            dict[user] = ev_msg.user;
            _this.setState({ position: dict });
          }
          //If a user switched line by pressing a cursor key the line has to be added to the lines hstory array so these also will render
          else if (ev_msg.type == 'addline') {
              _this.addLine(ev_msg.line);
            }
    });
    return _this;
  }

  //reset client after connect


  _createClass(LineIO, [{
    key: 'resetClient',
    value: function resetClient() {
      //Clear everything after server restart
      var dict = {};
      dict[user] = { x1: 0, y1: 0, x2: 0, y2: 0 };
      this.setState({
        event_msg: {}, //message from server
        position: dict,
        key: 'n/a', //key pressed
        lines: [] //list of all non current lines
      });
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
      var oldDirection = this.state.position[user].direction;

      if (this.state.position[user].x2 < w * 0.15) {
        if (oldDirection != "L") keypress = "R";else keypress = "D";
      } else if (this.state.position[user].y2 < h * 0.15) {
        if (oldDirection != "U") keypress = "D";else keypress = "R";
      } else if (this.state.position[user].x2 > w * 0.85) {
        if (oldDirection != "R") keypress = "L";else keypress = "U";
        console.log("sending left cmd to correct width " + this.state.position[user].x2);
      } else if (this.state.position[user].y2 > h * 0.85) {
        if (oldDirection != "D") keypress = "U";else keypress = "R";
        console.log("sending UP cmd to correct height " + this.state.position[user].y2);
      }

      if (oldDirection == "R" && keypress == "L") keypress = "D";else if (oldDirection == "L" && keypress == "R") keypress = "U";else if (oldDirection == "U" && keypress == "D") keypress = "R";else if (oldDirection == "D" && keypress == "U") keypress = "L";

      //normalise position on our virtual 1000x1000 grid
      var tempy = this.state.position[user];
      tempy["x1"] = tempy["x1"] / w * 1000;
      tempy["y1"] = tempy["y1"] / h * 1000;
      tempy["x2"] = tempy["x2"] / w * 1000;
      tempy["y2"] = tempy["y2"] / h * 1000;

      socket.emit('clientmessage', { type: "userCommand", user: user, command: keypress, line: tempy });
    }

    //client set timer, at this moment only used to simulate key events

  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.timer = setInterval(this.autoKeyPress, 1000); //1 second random movement
    }

    //keypress reveived to, eg , change the direction of our line

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var event = nextProps.keydown.event;

      if (event) {
        this.setState({ key: event.which });

        //normalise position on our virtual 1000x1000 grid
        var tempy = this.state.position[user];
        tempy["x1"] = tempy["x1"] / w * 1000;
        tempy["y1"] = tempy["y1"] / h * 1000;
        tempy["x2"] = tempy["x2"] / w * 1000;
        tempy["y2"] = tempy["y2"] / h * 1000;

        //Change direction after cursor press //, line: this.state.position[user]
        if (event.which == 37) {
          this.sendMessage({ type: "userCommand", user: user, command: "L", line: tempy });
        }
        if (event.which == 38) {
          this.sendMessage({ type: "userCommand", user: user, command: "U", line: tempy });
        }
        if (event.which == 39) {
          this.sendMessage({ type: "userCommand", user: user, command: "R", line: tempy });
        }
        if (event.which == 40) {
          this.sendMessage({ type: "userCommand", user: user, command: "D", line: tempy });
        }
      }
    }

    //Add line to our history, triggered after keypress/change of direction of line

  }, {
    key: 'addLine',
    value: function addLine(username) {}
    //this.setState({
    //lines: this.state.lines.concat(this.state.position[username])

    //});


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

    //We receive position of all player lines each .. period

  }, {
    key: 'receivePositions',
    value: function receivePositions(positions) {
      var _this2 = this;

      var w = window.innerWidth;
      var h = window.innerHeight;

      Object.keys(positions).map(function (username, index) {
        //Positions are based on a 1000x1000 blocks virtual field, translate to real window size
        positions[username]["x1"] = w / 1000 * positions[username].x1;
        positions[username]["y1"] = h / 1000 * positions[username].y1;
        positions[username]["x2"] = w / 1000 * positions[username].x2;
        positions[username]["y2"] = h / 1000 * positions[username].y2;

        //console.log("active line at pos" + JSON.stringify(positions ));
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

//Some stuff to remove later, might come in handy:

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