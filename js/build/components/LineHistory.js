'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Line = require('./Line');

var _Line2 = _interopRequireDefault(_Line);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var socket = (0, _socket2.default)('http://192.168.0.105:3000'); //our server 192.168.0.105

var LineHistory = function (_React$Component) {
  _inherits(LineHistory, _React$Component);

  function LineHistory(props) {
    _classCallCheck(this, LineHistory);

    var _this = _possibleConstructorReturn(this, (LineHistory.__proto__ || Object.getPrototypeOf(LineHistory)).call(this, props));

    _this.state = { codes: [] };

    _this.addLine = _this.addLine.bind(_this);
    _this.resetClient = _this.resetClient.bind(_this);
    _this.updateDimensions = _this.updateDimensions.bind(_this);

    //receive event from server
    socket.on('serverevent', function (ev_msg) {
      //console.log("Client receives server event type " + ev_msg.type  );
      if (ev_msg.type == 'addline') {
        //console.log("Client receives line to addline" + JSON.stringify(ev_msg.line ));

        //We split historical lines per slot , and give each slot a linehistory object to handled the events.
        //If the line's player has a slot which matches the slot of this handler lets pick up this event.
        if (parseInt(props.slot) == ev_msg.line.slot) {
          if (parseInt(props.split) == parseInt(ev_msg.split)) _this.addLine(ev_msg.line);
        }
      } else if (ev_msg.type == 'resetclients') {
        console.log("Client history lines resetting after server request");
        _this.resetClient();
      } else if (ev_msg.type == 'removeUser') {
        console.log("Remove from history: lines from user " + ev_msg.user);
        var codes = Object.assign([], _this.state.codes);
        codes = codes.filter(function (itm) {
          return itm["name"] !== ev_msg.user;
        });
        _this.setState({ codes: codes });
      }
    });
    return _this;
  }

  //Call when windows resized.


  _createClass(LineHistory, [{
    key: 'updateDimensions',
    value: function updateDimensions() {
      var orgWidth = this.state.width;
      var orgHeight = this.state.height;
      console.log("Width and Height resize to " + String(window.innerWidth) + " and " + String(window.innerHeight));
      var newWidth = window.innerWidth;
      var newHeight = window.innerHeight;
      //this.setState( { width :window.innerWidth, height: window.innerHeight })

      var codes = Object.assign([], this.state.codes);
      codes.map(function (line, index) {
        line["x1"] = newWidth / orgWidth * line["x1"];
        line["x2"] = newWidth / orgWidth * line["x2"];
        line["y1"] = newHeight / orgHeight * line["y1"];
        line["y2"] = newHeight / orgHeight * line["y2"];
      });

      this.setState({ codes: codes, width: window.innerWidth, height: window.innerHeight });
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var self = this;
      socket.on('connect', function (data) {
        console.log("Client was connected to history dispatcher using socket id " + String(socket.id));
        //self.setState({messages: data})
        //self.resetClient()
      });
      socket.on('disconnect', function () {
        console.log("Client was disconnected , clearing client on socket " + String(socket.id) + " within history dispatcher");
        self.resetClient();
      });

      this.updateDimensions();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener("resize", this.updateDimensions);
    }

    //remove any timers and listeners when client stops

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener("resize", this.updateDimensions);
    }

    //reset client after connect

  }, {
    key: 'resetClient',
    value: function resetClient() {
      this.setState({ codes: [] });
      this.forceUpdate();
    }

    //shouldComponentUpdate(nextProps, nextState) {
    //  return false;
    //}

    //Add line to our history, triggered after keypress/change of direction of line

  }, {
    key: 'addLine',
    value: function addLine(line) {
      var w = window.innerWidth;
      var h = window.innerHeight;

      //Positions are based on a 1000x1000 blocks virtual field, translate to real window size
      line["x1"] = Math.round(w / 1000 * line.x1 * 10) / 10;
      line["y1"] = Math.round(h / 1000 * line.y1 * 10) / 10;
      line["x2"] = Math.round(w / 1000 * line.x2 * 10) / 10;
      line["y2"] = Math.round(h / 1000 * line.y2 * 10) / 10;

      this.setState({ codes: this.state.codes.concat([line]) });
      //this.forceUpdate()
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'Lineio' },
        this.state.codes.map(function (item, index) {
          return _react2.default.createElement(_Line2.default, { key: String(item.name + String(index)), from: { x: item.x1, y: item.y1 }, to: { x: item.x2, y: item.y2 }, style: item.styling });
        })
      );
    }
  }]);

  return LineHistory;
}(_react2.default.Component);

LineHistory.propTypes = {
  url: _react2.default.PropTypes.string, //Not yet used, at some point backend will be added
  slot: _react2.default.PropTypes.string, //This dispatchers handles all inactive lines for player using thi slot.
  split: _react2.default.PropTypes.string //The split determines the screen section (quator of window) to update based on start position of the line
};

LineHistory.defaultProps = {
  url: "http://localhost:3000/pandaweb/all",
  slot: "-1",
  split: "-1"
};

exports.default = LineHistory;