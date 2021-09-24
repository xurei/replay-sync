import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { VCenter } from 'xureact';
import deepEqual from 'deep-eql'; //eslint-disable-line no-unused-vars

class MockPlayer extends React.Component {
  static propTypes = {
    video_id: PropTypes.string.isRequired,
    currentTime: PropTypes.number.isRequired,
    muteOnStart: PropTypes.bool,
    shouldPlay: PropTypes.bool,
    onEnded: PropTypes.func,
    onPlayerStateChange: PropTypes.func,
    onTimeUpdate: PropTypes.func,
  };
  
  embedId = null;
  firstLoad = true;
  
  state = {
    status: 'init',
    time: 0,
  };
  
  constructor(props) {
    super(props);
    this.embedId = `twitch-player-${Math.floor(Math.random()*100000)}`;
    this.handleEventReady = this.handleEventReady.bind(this);
    this.handleEventEnded = this.handleEventEnded.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleAdd1s = this.handleAdd1s.bind(this);
    this.handleSeek5m42s = this.handleSeek5m42s.bind(this);
    this.handleSeek3m23s = this.handleSeek3m23s.bind(this);
    this.forwardPlayerStateUpdate = this.forwardPlayerStateUpdate.bind(this);
  }
  
  componentDidMount() {
    const props = this.props;
    console.log('Mounted with ', props.currentTime);
    this.setState(state => ({
      ...state,
      time: props.currentTime,
    }));
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    const props = this.props;
    const state = this.state;
    
    if (!deepEqual(props, prevProps)) {
      console.log('diff props', prevProps, props);
      if (prevProps.video_id !== props.video_id) {
        /*console.log('Switchting to video ' + props.video_id);
        this.setState(state => ({
          ...state,
          switching: true,
        }));*/
        this.handlePause();
        this.setState(state => ({
          ...state,
          status: 'init',
          time: props.currentTime,
        }));
      }
      else if (props.shouldPlay) {
        if (state.status === 'Idle' || state.status === 'Ready') {
          console.log(props.video_id, "Force play");
          this.handlePlay();
        }
      }
      else {
        if (state.status !== 'init' && state.status !== 'Idle' && state.status !== 'Ready') {
          console.log(props.video_id, "Force pause");
          //this.handlePause();
          this.setState(state => ({
            ...state,
            status: 'Idle',
          }));
        }
      }
    }
  }
  
  render() {
    const props = this.props;
    const state = this.state;
    return (
      <div id={this.embedId} style={{ height: '100%', textAlign: 'center' }}>
        <VCenter>
          <div>Status : {state.status}</div>
          <div>Time : {state.time} | {props.currentTime}</div>
          <div>
            <button onClick={this.handleEventReady}>Load Video</button>
          </div>
          <div>
            <button onClick={this.handlePlay}>Play</button>
            <button onClick={this.handlePause}>Pause</button>
          </div>
          <div><button disabled={state.status!=='Playing'} onClick={this.handleAdd1s}>Add 1s</button></div>
          <div><button>Seek to 5m42s</button></div>
          <div><button>Seek to 3m23s</button></div>
          <div>
            <button onClick={this.handleEventEnded}>End Video</button>
          </div>
          <pre>{JSON.stringify(props, null, '  ')}</pre>
          <pre>{JSON.stringify(state, null, '  ')}</pre>
        </VCenter>
      </div>
    );
  }
  
  handlePlay() {
    this.setState(state => ({
      ...state,
      status: 'Playing',
    }), this.forwardPlayerStateUpdate);
  }
  handlePause() {
    this.setState(state => ({
      ...state,
      status: 'Idle',
    }), this.forwardPlayerStateUpdate);
  }
  handleAdd1s() {
    this.setState(state => ({
      ...state,
      time: state.time + 1000,
    }), this.forwardPlayerStateUpdate);
  }
  handleSeek5m42s() {
    this._handleSeek((5*60+42)*1000);
  }
  handleSeek3m23s() {
    this._handleSeek((3*60+23)*1000);
  }
  _handleSeek(time) {
    this.setState(state => ({
      ...state,
      time: time,
    }), this.forwardPlayerStateUpdate);
  }
  
  handleEventReady() {
    this.setState(state => ({
      ...state,
      status: 'Ready',
    }), this.forwardPlayerStateUpdate);
    //this.props.onReady();
  }
  
  handleEventEnded() {
    this.props.onEnded();
  }
  
  forwardPlayerStateUpdate() {
    const props = this.props;
    const state = this.state;
    console.log('forwardPlayerStateUpdate', state);
    if (props.onPlayerStateChange) {
      props.onPlayerStateChange(state);
    }
  }
}

export { MockPlayer };
