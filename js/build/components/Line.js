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

  function Line(props) {
    _classCallCheck(this, Line);

    return _possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).call(this, props));
  }

  _createClass(Line, [{
    key: 'render',
    value: function render() {

      var from = this.props.from;
      var to = this.props.to;
      if (to.x < from.x || to.y < from.y) {
        from = this.props.to;
        to = this.props.from;
      }

      var style = {
        position: 'absolute',
        left: '' + from.x,
        top: '' + from.y,
        width: to.x - from.x + 'px',
        height: to.y - from.y + 'px',
        border: this.props.style || '1px solid black'
      };

      //if (to.y == from.y)
      //  style["borderBottom"] = this.props.style || '1px solid black'
      //else if (to.x == from.x)
      //  style["borderLeft"] = this.props.style || '1px solid black'

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