import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import deepEqual from 'deep-eql'; //eslint-disable-line no-unused-vars
import { tsToVodTime } from '../time-util.js';

class TwitchPlayer extends React.Component {
  static propTypes = {
    video_id: PropTypes.string.isRequired,
    currentTime: PropTypes.number.isRequired,
    forceSource: PropTypes.bool,
    muteOnStart: PropTypes.bool,
    shouldPlay: PropTypes.bool,
    onPlayerStateChange: PropTypes.func,
    onPlayerTimeChange: PropTypes.func,
  };
  
  player = null;
  embedId = null;
  prevPlayerState = null;
  
  state = {
    ready: false,
  };
  
  constructor(props) {
    super(props);
    this.embedId = `twitch-player-${Math.floor(Math.random()*100000)}`;
    this.handleEventReady = this.handleEventReady.bind(this);
    this.handleEventEnded = this.handleEventEnded.bind(this);
    this.handleEventUpdateState = this.handleEventUpdateState.bind(this);
  }
  
  get options() {
    const props = this.props;
    const currentTime = props.currentTime < 1000 ? 1000 : props.currentTime;
    return {
      width: '100%',
      height: '100%',
      video: props.video_id,
      autoplay: props.shouldPlay,
      muted: props.muteOnStart,
      time: tsToVodTime(currentTime),
    };
  }
  
  componentDidMount() {
    const props = this.props;
    this.player = new Twitch.Embed(this.embedId, this.options);
    this.player.addEventListener(Twitch.Player.VIDEO_READY, this.handleEventReady);
    this.player.addEventListener(Twitch.Player.ENDED, this.handleEventEnded);
    this.player.addEventListener('UPDATE_STATE', this.handleEventUpdateState);
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    const props = this.props;
    if (prevProps.video_id !== props.video_id) {
      this.player.pause();
      this.player.setVideo(this.props.video_id, Math.floor(this.props.startAt));
    }
    else if (props.currentTime !== prevProps.currentTime) {
      const curTime = this.player.getCurrentTime() * 1000;
      if (Math.abs(curTime - props.currentTime) > 3000) {
        //console.log(`${props.video_id} MUST SEEK: ${tsToVodTime(curTime)}->${tsToVodTime(props.currentTime)} (${props.currentTime - curTime}s)`, prevProps, props);
        this.player.seek(props.currentTime / 1000);
      }
    }
    if (props.shouldPlay) {
      if (this.player.isPaused()) {
        console.log(` >  >  > Force play`);
        this.player.play();
      }
    }
    else {
      if (!this.player.isPaused()) {
        console.log(` || || || Force pause`);
        this.player.pause();
      }
    }
  }
  
  render() {
    return (
      <div id={this.embedId} style={{height: '100%'}}/>
    );
  }
  
  handleEventReady() {
    const props = this.props;
    if (props.onReady) {
      props.onReady();
    }
  }
  
  handleEventEnded() {
    const props = this.props;
    if (props.onEnded) {
      props.onEnded();
    }
  }
  
  handleEventUpdateState(_playerState) {
    const props = this.props;
    const state = this.state;
  
    const playerState = {
      currentTime: _playerState.currentTime,
      ended: _playerState.ended,
      muted: _playerState.muted,
      playback: _playerState.playback,
      qualitiesAvailable: _playerState.qualitiesAvailable,
    };
    
    if (!deepEqual(this.prevPlayerState, playerState)) {
      if (!state.ready) {
        //console.log(playerState);
        if (playerState.playback === 'Ready' && playerState.qualitiesAvailable && playerState.qualitiesAvailable.length > 0) {
          if (props.forceSource) {
            this.player.setQuality('chunked');
          }
          else {
            const qualities = this.player.getQualities();
            const bestCleanQuality = qualities.filter(q => q.group!=='auto' && q.group!=='chunked')[0];
            if (bestCleanQuality) {
              this.player.setQuality(bestCleanQuality.group);
          }
          else {
            this.player.setQuality('chunked');}
          }
          this.setState(state => ({
            ...state,
            ready: true,
          }));
        }
      }
      else {
        //console.log(playerState);
        if (this.prevPlayerState.playback !== playerState.playback) {
          props.onPlayerStateChange(playerState.playback);
        }
  
        //const time = playerState.currentTime * 1000;
        //if (time !== this.player.getCurrentTime()*1000) {
        //  console.log(`${tsToVodTime(time)} vs ${tsToVodTime(this.player.getCurrentTime()*1000)}`);
        //  console.log(`${(time)} vs ${(this.player.getCurrentTime()*1000)}`);
        //}
  
        if (
          this.prevPlayerState.currentTime !== playerState.currentTime
          && (playerState.playback === 'Playing' || playerState.playback === 'Buffering')
        ) {
          props.onPlayerTimeChange(Math.floor(playerState.currentTime*1000), this.player.getMuted());
        }
      }
      this.prevPlayerState = playerState;
    }
  }
  
  componentWillUnmount() {
    this.player.removeEventListener(Twitch.Player.VIDEO_READY, this.handleEventReady);
    this.player.removeEventListener(Twitch.Player.ENDED, this.handleEventEnded);
    this.player.removeEventListener('UPDATE_STATE', this.handleEventUpdateState);
  }
  
  /*shouldComponentUpdate(nextProps) {
    return this.props.video_id !== nextProps.video_id;
  }*/
}

export { TwitchPlayer };
