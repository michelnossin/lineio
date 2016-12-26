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

    _this.sendMessage.bind(_this);
    _this.receiveMessage.bind(_this);
    _this.receivePositions.bind(_this);
    _this.addLine.bind(_this);

    //received connect from server
    socket.on('connect', function () {
      console.log("Client receives connect event");
      //this.sendMessage({ type: "userHandshake", user: user }) //ask server to join game
      socket.emit('clientmessage', { type: "userHandshake", user: user });
    });

    //receive event from server
    socket.on('serverevent', function (ev_msg) {
      if (ev_msg.type == 'servermessage') {
        _this.receiveMessage(ev_msg.message);
      }
      if (ev_msg.type == 'positions') {
        //console.log("event postion : " + JSON.stringify(ev_msg) );
        _this.receivePositions(ev_msg.players);
      }
    });
    return _this;
  }

  //keypress reveived to, eg , change the direction of our line


  _createClass(LineIO, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var event = nextProps.keydown.event;

      if (event) {
        this.setState({ key: event.which });
        //Change direction after cursor press
        if (event.which == 37) {
          this.sendMessage({ type: "userCommand", user: user, command: "L" });
        }
        if (event.which == 38) {
          this.sendMessage({ type: "userCommand", user: user, command: "U" });
        }
        if (event.which == 39) {
          this.sendMessage({ type: "userCommand", user: user, command: "R" });
        }
        if (event.which == 40) {
          this.sendMessage({ type: "userCommand", user: user, command: "D" });
        }

        this.addLine();
      }
    }

    //Add line to our history, triggered after keypress/change of direction of line

  }, {
    key: 'addLine',
    value: function addLine() {
      // State change will cause component re-render
      var saveLine = this.state.position[user];
      console.log("saving line : " + JSON.stringify(saveLine));
      var newx = this.state.position[user].x2;
      var newy = this.state.position[user].y2;

      var newLine = {};
      newLine[user] = { x1: newx, y1: newy, x2: newx, y2: newy };

      this.setState({
        lines: this.state.lines.concat(saveLine),
        position: newLine
      });

      console.log("main lines after concat : " + JSON.stringify(this.state.lines));
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

    //We receive position of all player lines each .. period

  }, {
    key: 'receivePositions',
    value: function receivePositions(positions) {

      //console.log("positions " + JSON.stringify(positions) );
      //console.log("position user " + JSON.stringify(positions[user]) );

      if (positions[user]) {
        var w = window.innerWidth; //Positions are based on a 1000x1000 blocks virtual field, translate to real window size
        var h = window.innerHeight;
        var p1x1 = w / 1000 * positions[user].x1;
        var p1y1 = h / 1000 * positions[user].y1;
        var p1x2 = w / 1000 * positions[user].x2;
        var p1y2 = h / 1000 * positions[user].y2;

        var dt = {};
        dt[user] = { x1: p1x1, y1: p1y1, x2: p1x2, y2: p1y2 };
        this.setState({ position: dt });
      }
    }

    //Click on element handling, not used at this moment

  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      e.preventDefault();
      //console.log("Client is sending message after click");
      this.sendMessage({ type: 'userMessage', message: 'This is an event from client to server after a click' });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'Lineio' },
        this.state.lines.map(function (item, index) {
          return _react2.default.createElement(_Line2.default, {
            key: index,
            from: { x: item.x1, y: item.y1 },
            to: { x: item.x2, y: item.y2 }, style: '5px solid orange' });
        }),
        _react2.default.createElement(_Line2.default, {
          from: { x: this.state.position[user].x1, y: this.state.position[user].y1 },
          to: { x: this.state.position[user].x2, y: this.state.position[user].y2 }, style: '5px solid orange' }),
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

//render() {
//  return (
//    <div className="Lineio" >
//    { this.state.lines.map((item,index) => (
//      <Line
//      key={index}
//      from={{x: item.line.userA.x1, y: item.line.userA.y1}}
//      to={{x: item.line.userA.x2, y: item.line.userA.y2}} style="5px solid orange"/>
//    )) }
//    <Line
//    from={{x: this.state.event_pos.userA.x1, y: this.state.event_pos.userA.y1}}
//    to={{x: this.state.event_pos.userA.x2, y: this.state.event_pos.userA.y2}} style="5px solid orange"/>
//    <footer>{this.state.event_msg.message}</footer>
//     </div>
//  );
//}


//Below just some temporary code we might be needed later. To remove sometime:
//{this.state.lines.map((item,index) => (<h1 key={index}>{item.command}</h1> )) }

//<Line
//from={{x: this.state.event_pos.userB.x1, y: this.state.event_pos.userB.y1}}
//to={{x: this.state.event_pos.userB.x2, y: this.state.event_pos.userB.y2}} style="5px solid red"/>

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