import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import YouTube from 'react-youtube';
import { tsToVodTime } from '../time-util.js';

const STATE_UNSTARTED = -1;
const STATE_ENDED = 0;
const STATE_PLAYING = 1;
const STATE_PAUSED = 2;
const STATE_BUFFERING = 3;
const STATE_READY = 5;

class YoutubePlayer extends React.Component {
  static propTypes = {
    video_id: PropTypes.string.isRequired,
    currentTime: PropTypes.number.isRequired,
    muteOnStart: PropTypes.bool,
    shouldPlay: PropTypes.bool,
    onPlayerStateChange: PropTypes.func,
    onPlayerTimeChange: PropTypes.func,
  };
  
  player = null;
  youtubeOptions = null;
  timerInterval = null;
  
  constructor(props) {
    super(props);
    this.youtubeOptions = {
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: props.shouldPlay ? 1 : 0,
        modestbranding: 1,
        enablejsapi: 1,
        mute: props.muteOnStart ? 1 : 0,
        rel: 0,
        controls: 1,
        start: Math.max(1, Math.floor((props.currentTime || 0) / 1000.0)),
      },
    };
    
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleReady = this.handleReady.bind(this);
  }
  
  componentDidMount() {
    this.timerInterval = setInterval(() => {
      if (this.player) {
        const playerState = this.player.getPlayerState();
        const isMuted = this.player.isMuted();
        if (playerState === STATE_PLAYING) {
          const time = this.player.getCurrentTime();
          if (time) {
            this.props.onPlayerTimeChange(Math.floor(time * 1000), isMuted);
          }
        }
      }
    }, 1000);
  }
  
  componentWillUnmount() {
    clearInterval(this.timerInterval);
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.player) {
      const props = this.props;
      if (props.currentTime !== prevProps.currentTime) {
        const curTime = this.player.getCurrentTime() * 1000;
        const videoDuration = this.player.getDuration() * 1000;
        const seekTarget = Math.min(props.currentTime, videoDuration-1000);
        if (Math.abs(curTime - seekTarget) > 3000) {
          console.log(`${props.video_id} MUST SEEK: ${tsToVodTime(curTime)}->${tsToVodTime(seekTarget)} (${seekTarget - curTime}s)`, prevProps, props);
          this.player.seekTo(seekTarget / 1000, true);
        }
      }
      const playerState = this.player.getPlayerState();
      if (props.shouldPlay) {
        if (playerState !== STATE_PLAYING && playerState !== STATE_BUFFERING && playerState !== STATE_ENDED) {
          console.log(`${props.video_id} >  >  > Force play`);
          try {
            this.player.playVideo();
          }
          catch (e) {
            console.error('ERR');
          }
        }
      }
      else {
        if (playerState === STATE_PLAYING) {
          console.log(`${props.video_id} || || || Force pause`);
          try {
            this.player.pauseVideo();
          }
          catch (e) {
            console.error('ERR');
          }
        }
      }
    }
  }
  
  render() {
    const props = this.props;
    return (
      <YouTube
        videoId={props.video_id}
        opts={this.youtubeOptions}
        containerClassName="fullh"
        className="fullh"
        
        onPause={e => {
          console.log('PAUSE');
        }}
        onReady={this.handleReady}
        onStateChange={this.handleStateChange}
      />
    );
  }
  
  handleReady(e) {
    this.player = e.target;
  }
  
  handleStateChange(e) {
    const props = this.props;
    console.log(`${props.video_id} State change: ${e.data}`);
    let playerState = -2;
    switch (e.data) {
      case STATE_UNSTARTED:
        playerState = 'Init';
        break;
      case STATE_ENDED:
        playerState = 'Ended';
        break;
      case STATE_PLAYING:
        playerState = 'Playing';
        break;
      case STATE_PAUSED:
        playerState = 'Idle';
        break;
      case STATE_BUFFERING:
        playerState = 'Buffering';
        break;
      case STATE_READY:
        playerState = 'Ready';
        break;
    }
    props.onPlayerStateChange(playerState);
  }
  
  /*shouldComponentUpdate(nextProps) {
    return this.props.video_id !== nextProps.video_id;
  }*/
}

export { YoutubePlayer };
