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

_reactDom2.default.render(_react2.default.createElement(
  'div',
  null,
  _react2.default.createElement(_LineHistory2.default, null),
  _react2.default.createElement(_LineIO2.default, null)
), document.getElementById('app'));