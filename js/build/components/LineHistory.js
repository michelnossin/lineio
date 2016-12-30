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

var socket = (0, _socket2.default)('http://192.168.0.102:3000'); //our server

var LineHistory = function (_React$Component) {
  _inherits(LineHistory, _React$Component);

  function LineHistory(props) {
    _classCallCheck(this, LineHistory);

    var _this = _possibleConstructorReturn(this, (LineHistory.__proto__ || Object.getPrototypeOf(LineHistory)).call(this, props));

    _this.state = { codes: [] };

    _this.addLine = _this.addLine.bind(_this);
    _this.resetClient = _this.resetClient.bind(_this);

    //receive event from server
    socket.on('serverevent', function (ev_msg) {
      //console.log("Client receives server event type " + ev_msg.type  );
      if (ev_msg.type == 'addline') {
        console.log("Client receives line to addline" + JSON.stringify(ev_msg.line));

        if (parseInt(props.slot) == ev_msg.line.slot)
          //console.log("Player making this changes used the slot this history line handler users")
          _this.addLine(ev_msg.line);
        //else
        //console.log("Client receives line to addline"
      }
    });
    return _this;
  }

  //reset client after connect


  _createClass(LineHistory, [{
    key: 'resetClient',
    value: function resetClient() {
      this.setState({ codes: [] });
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
  slot: _react2.default.PropTypes.string
};

LineHistory.defaultProps = {
  url: "http://localhost:3000/pandaweb/all",
  slot: "-1"
};

exports.default = LineHistory;