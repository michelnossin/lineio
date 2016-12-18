'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //This code was copied and altered using react line package.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
//OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
//ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
//SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var Line = function (_React$Component) {
  _inherits(Line, _React$Component);

  function Line() {
    _classCallCheck(this, Line);

    return _possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).apply(this, arguments));
  }

  _createClass(Line, [{
    key: 'render',
    value: function render() {
      var from = this.props.from;
      var to = this.props.to;
      if (to.x < from.x) {
        from = this.props.to;
        to = this.props.from;
      }

      var len = Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
      var angle = Math.atan((to.y - from.y) / (to.x - from.x));

      var style = {
        position: 'absolute',
        transform: 'translate(' + (from.x - .5 * len * (1 - Math.cos(angle))) + 'px, ' + (from.y + .5 * len * Math.sin(angle)) + 'px) rotate(' + angle + 'rad)',
        width: len + 'px',
        height: 0 + 'px',
        borderBottom: this.props.style || '1px solid black'
      };

      return _react2.default.createElement('div', { style: style });
    }
  }]);

  return Line;
}(_react2.default.Component);

Line.propTypes = {
  from: _react2.default.PropTypes.shape({
    x: _react2.default.PropTypes.number.isRequired,
    y: _react2.default.PropTypes.number.isRequired
  }),
  to: _react2.default.PropTypes.shape({
    x: _react2.default.PropTypes.number.isRequired,
    y: _react2.default.PropTypes.number.isRequired
  }),
  style: _react2.default.PropTypes.string
};

exports.default = Line;