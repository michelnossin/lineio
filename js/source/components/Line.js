//This code was copied and altered using react line package.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
//OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
//ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
//SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import React from 'react';

class Line extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    let from = this.props.from;
    let to = this.props.to;
    if ((to.x < from.x) || (to.y < from.y)) {
      from = this.props.to;
      to = this.props.from;
    }

    const style = {
      position: 'absolute',
      left:`${from.x}`,
      top: `${from.y}`,
      width: `${to.x - from.x }px`,
      height: `${to.y - from.y}px`,
      borderBottom: this.props.style || '1px solid black',
      borderLeft: this.props.style || '1px solid black'
    };

    return <div style={style}></div>;
  }
}

Line.propTypes = {
  from: React.PropTypes.shape({
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
  }),
  to: React.PropTypes.shape({
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
  }),
  style: React.PropTypes.string
};

export default Line;
