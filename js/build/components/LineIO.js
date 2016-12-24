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

var LineIO = (0, _reactKeydown2.default)(_class = function (_React$Component) {
  _inherits(LineIO, _React$Component);

  function LineIO(props) {
    _classCallCheck(this, LineIO);

    var _this = _possibleConstructorReturn(this, (LineIO.__proto__ || Object.getPrototypeOf(LineIO)).call(this, props));

    _this.state = {
      event_msg: {}, //message from server
      event_pos: { userA: { x1: 0, y1: 0, x2: 0, y2: 0 }, userB: { x1: 0, y1: 0, x2: 0, y2: 0 } }, //All player positions
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
    });

    //receive event from server
    socket.on('serverevent', function (ev_msg) {
      if (ev_msg.type == 'servermessage') {
        _this.receiveMessage(ev_msg.message);
      }
      if (ev_msg.type == 'positions') {
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
          this.sendMessage({ type: "userCommand", user: "userA", command: "L" });
        }
        if (event.which == 38) {
          this.sendMessage({ type: "userCommand", user: "userA", command: "U" });
        }
        if (event.which == 39) {
          this.sendMessage({ type: "userCommand", user: "userA", command: "R" });
        }
        if (event.which == 40) {
          this.sendMessage({ type: "userCommand", user: "userA", command: "D" });
        }
        //if (event.which in [37,38,39,40] ) { this.addLine(this.state.event_pos) }  //save current line to history
        this.addLine(this.state.event_pos);
      }
    }

    //Add line to our history, triggered after keypress/change of direction of line

  }, {
    key: 'addLine',
    value: function addLine(line) {
      // State change will cause component re-render

      //Current endpoint will become new begin point
      var newx = this.state.event_pos.userA.x2;
      var newy = this.state.event_pos.userA.y2;
      var userB = this.state.event_pos.userB;

      this.setState({
        lines: this.state.lines.concat([{ line: line }]),
        event_pos: { userA: { x1: newx, y1: newy, x2: newx, y2: newy }, userB: userB }
      });
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

      var w = window.innerWidth; //Positions are based on a 1000x1000 blocks virtual field, translate to real window size
      var h = window.innerHeight;
      var p1x1 = w / 1000 * positions.userA.x1;
      var p1y1 = h / 1000 * positions.userA.y1;
      var p1x2 = w / 1000 * positions.userA.x2;
      var p1y2 = h / 1000 * positions.userA.y2;
      //if (p1x2 < p1x1) { [p1x1, p1x2] = [p1x2, p1x1];}

      var p2x1 = w / 1000 * positions.userB.x1;
      var p2y1 = h / 1000 * positions.userB.y1;
      var p2x2 = w / 1000 * positions.userB.x2;
      var p2y2 = h / 1000 * positions.userB.y2;
      //if (p2x2 < p2x1) { [p2x1, p2x2] = [p2x2, p2x1];}

      this.setState({ event_pos: { userA: { x1: p1x1, y1: p1y1, x2: p1x2, y2: p1y2 }, userB: { x1: p2x1, y1: p2y1, x2: p2x2, y2: p2y2 } } });
    }

    //Click on element handling, not used at this moment

  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      e.preventDefault();
      //console.log("Client is sending message after click");
      this.sendMessage({ type: 'userMessage', message: 'This is an event from client to server after a click' });
    }

    //Render our game initially with 2 players each having 1 line

  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'Lineio' },
        this.state.lines.map(function (item, index) {
          return _react2.default.createElement(_Line2.default, {
            key: index,
            from: { x: item.line.userA.x1, y: item.line.userA.y1 },
            to: { x: item.line.userA.x2, y: item.line.userA.y2 }, style: '5px solid orange' });
        }),
        _react2.default.createElement(_Line2.default, {
          from: { x: this.state.event_pos.userA.x1, y: this.state.event_pos.userA.y1 },
          to: { x: this.state.event_pos.userA.x2, y: this.state.event_pos.userA.y2 }, style: '5px solid orange' }),
        _react2.default.createElement(_Line2.default, {
          from: { x: this.state.event_pos.userB.x1, y: this.state.event_pos.userB.y1 },
          to: { x: this.state.event_pos.userB.x2, y: this.state.event_pos.userB.y2 }, style: '5px solid red' }),
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