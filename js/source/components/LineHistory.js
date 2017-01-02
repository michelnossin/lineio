import React from 'react';
import Line from './Line';
import io from 'socket.io-client'
let socket = io(`http://192.168.0.105:3000`) //our server 192.168.0.105

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
        //console.log("Client receives line to addline" + JSON.stringify(ev_msg.line ));

        //We split historical lines per slot , and give each slot a linehistory object to handled the events.
        //If the line's player has a slot which matches the slot of this handler lets pick up this event.
        if (parseInt(props.slot) == ev_msg.line.slot) {
          if (parseInt(props.split) == parseInt(ev_msg.split))
            this.addLine(ev_msg.line)

        }
      }
      else if (ev_msg.type == 'resetclients') {
          console.log("Client history lines resetting after server request")
          this.resetClient()
      }
      else if (ev_msg.type == 'removeUser') {
          console.log("Remove from history: lines from user " + ev_msg.user )
          var codes = Object.assign([],this.state.codes)
          codes=codes.filter(function(itm){return itm["name"]!==ev_msg.user});
          this.setState( { codes: codes })
      }
    })
  }

  componentWillMount(){
    var self = this;
    socket.on('connect', function (data) {
      console.log("Client was connected to history dispatcher "  );
      //self.setState({messages: data})
      //self.resetClient()
    });
    socket.on('disconnect', function() {
      console.log("Client was disconnected , clearing client within history dispatcher"  );
      self.resetClient()
    })
  }

  //reset client after connect
  resetClient() {
    this.setState({ codes : [] });
    this.forceUpdate()
  }

  //shouldComponentUpdate(nextProps, nextState) {
  //  return false;
  //}

  //Add line to our history, triggered after keypress/change of direction of line
  addLine(line) {
    let w = window.innerWidth
    let h = window.innerHeight

    //Positions are based on a 1000x1000 blocks virtual field, translate to real window size
    line["x1"] = Math.round( ((w/1000) * line.x1) * 10) /10
    line["y1"] = Math.round( ((h/1000) * line.y1) * 10) /10
    line["x2"] = Math.round( ((w/1000) * line.x2) * 10) /10
    line["y2"] = Math.round( ((h/1000) * line.y2) * 10) /10

    this.setState({codes : this.state.codes.concat([line])})
    //this.forceUpdate()
  }

  render() {
    return (
      <div className="Lineio" >
      {this.state.codes.map((item,index) => (
        <Line key={String(item.name + String(index))} from={{x: item.x1, y: item.y1}} to={{x: item.x2, y: item.y2}} style={item.styling} />
      ))}
       </div>
    );
  }
}

LineHistory.propTypes = {
    url: React.PropTypes.string,  //Not yet used, at some point backend will be added
    slot: React.PropTypes.string, //This dispatchers handles all inactive lines for player using thi slot.
    split: React.PropTypes.string //The split determines the screen section (quator of window) to update based on start position of the line
};

LineHistory.defaultProps = {
    url: "http://localhost:3000/pandaweb/all",
    slot: "-1",
    split: "-1"
};

export default LineHistory;
