import React from 'react';
import Line from './Line';

class LineIO extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        refresh: 1,
        x1: 100,
        y1: 100,
        x2: 200,
        y2: 200
    };

    this.setLine.bind(this)
  }

  setLine(x1,y1,x2,y2) {
     if (this.state.refresh == 1) {
       this.setState({refresh: 1,x1: x1,y1: y1,x2: x2,y2: y2 })
     }
   }

  handleClick(e) {
    e.preventDefault();
    this.setLine(this.state.x1 ,this.state.y1 ,this.state.x2 + 20,this.state.y2 + 20)
  }

  render() {

    return (
      <div className="Lineio">
      <a href="#" onClick={ (e) => this.handleClick(e) }>Click me</a>
      <Line
      from={{x: this.state.x1, y: this.state.y2}}
      to={{x: this.state.x2, y: this.state.y2}}
      style="5px solid orange"/>
       </div>
    );
  }
}

LineIO.propTypes = {
    url: React.PropTypes.string  //Not yet used, at some point backend will be added
};

LineIO.defaultProps = {
    url: "http://localhost:3000/pandaweb/all"
};

export default LineIO;
