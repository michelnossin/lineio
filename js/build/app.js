'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _LineIO = require('./components/LineIO');

var _LineIO2 = _interopRequireDefault(_LineIO);

var _LineHistory = require('./components/LineHistory');

var _LineHistory2 = _interopRequireDefault(_LineHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//By splitting realtime lines, and the cumulative hitory of lines we prevent history of being refreshed 50 times per second.
//Also we split history per slot, to prevent the whole game to be rendered after each keypress of any user.
_reactDom2.default.render(_react2.default.createElement(
  'div',
  null,
  _react2.default.createElement(_LineHistory2.default, { slot: '0' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '1' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '2' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '3' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '4' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '5' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '6' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '7' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '8' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '9' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '10' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '11' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '12' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '13' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '14' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '15' }),
  _react2.default.createElement(_LineIO2.default, null)
), document.getElementById('app'));