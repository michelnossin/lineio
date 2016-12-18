'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Line = require('./Line');

var _Line2 = _interopRequireDefault(_Line);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LineIO = function (_React$Component) {
  _inherits(LineIO, _React$Component);

  function LineIO(props) {
    _classCallCheck(this, LineIO);

    var _this = _possibleConstructorReturn(this, (LineIO.__proto__ || Object.getPrototypeOf(LineIO)).call(this, props));

    _this.state = {
      refresh: 1,
      x1: 100,
      y1: 100,
      x2: 200,
      y2: 200
    };

    _this.setLine.bind(_this);
    return _this;
  }

  _createClass(LineIO, [{
    key: 'setLine',
    value: function setLine(x1, y1, x2, y2) {
      if (this.state.refresh == 1) {
        this.setState({ refresh: 1, x1: x1, y1: y1, x2: x2, y2: y2 });
      }
    }
  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      e.preventDefault();
      this.setLine(this.state.x1, this.state.y1, this.state.x2 + 20, this.state.y2 + 20);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'Lineio' },
        _react2.default.createElement(
          'a',
          { href: '#', onClick: function onClick(e) {
              return _this2.handleClick(e);
            } },
          'Click me'
        ),
        _react2.default.createElement(_Line2.default, {
          from: { x: this.state.x1, y: this.state.y2 },
          to: { x: this.state.x2, y: this.state.y2 },
          style: '5px solid orange' })
      );
    }
  }]);

  return LineIO;
}(_react2.default.Component);

LineIO.propTypes = {
  url: _react2.default.PropTypes.string //Not yet used, at some point backend will be added
};

LineIO.defaultProps = {
  url: "http://localhost:3000/pandaweb/all"
};

exports.default = LineIO;