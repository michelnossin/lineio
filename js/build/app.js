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
//Also we split history per slot, and per split , which covers a quator of the windows.
//to prevent the whole game to be rendered after each keypress of any user.
_reactDom2.default.render(_react2.default.createElement(
  'div',
  null,
  _react2.default.createElement(_LineHistory2.default, { slot: '0', split: '0' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '0', split: '1' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '0', split: '2' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '0', split: '3' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '1', split: '0' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '1', split: '1' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '1', split: '2' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '1', split: '3' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '2', split: '0' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '2', split: '1' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '2', split: '2' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '2', split: '3' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '3', split: '0' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '3', split: '1' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '3', split: '2' }),
  _react2.default.createElement(_LineHistory2.default, { slot: '3', split: '3' }),
  _react2.default.createElement(_LineIO2.default, null)
), document.getElementById('app'));