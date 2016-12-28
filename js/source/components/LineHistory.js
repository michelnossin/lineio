import React from 'react';
import Line from './Line';
import io from 'socket.io-client'
let socket = io(`http://localhost:3000`) //our server

class LineHistory extends React.Component {

  constructor(props) {
    super(props);
    this.state = { codes : [] };

    this.addLine = this.addLine.bind(this)
    this.resetClient = this.resetClient.bind(this)

    //receive event from server
    socket.on('serverevent', ev_msg => {
      //console.log("Client receives server event type " + ev_msg.type  );
      if (ev_msg.type == 'addline') {
        console.log("Client receives line to addline" + JSON.stringify(ev_msg.line ));
          this.addLine(ev_msg.line)
      }
    })
  }

  //reset client after connect
  resetClient() {
    this.setState({ codes : [] });
  }


  //Add line to our history, triggered after keypress/change of direction of line
  addLine(line) {
    let w = window.innerWidth
    let h = window.innerHeight


    //Positions are based on a 1000x1000 blocks virtual field, translate to real window size
    line["x1"] = (w/1000) * line.x1
    line["y1"] = (h/1000) * line.y1
    line["x2"] = (w/1000) * line.x2
    line["y2"] = (h/1000) * line.y2


      //for (var index in Object.keys(this.state)) {
    this.setState({codes : this.state.codes.concat([line])})
      //}
    }

  render() {
    return (
      <div className="Lineio" >
      {this.state.codes.map((item,index) => (
        <Line key={index} from={{x: item.x1, y: item.y1}} to={{x: item.x2, y: item.y2}} style={item.styling} />
      ))}
       </div>
    );
  }
}

LineHistory.propTypes = {
    url: React.PropTypes.string,  //Not yet used, at some point backend will be added
};

LineHistory.defaultProps = {
    url: "http://localhost:3000/pandaweb/all",
};

export default LineHistory;
