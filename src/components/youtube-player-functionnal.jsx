import React, { useCallback, useEffect, useMemo, useRef } from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import YouTube from 'react-youtube';
import { tsToVodTime } from '../time-util.js';

const STATE_UNSTARTED = -1;
const STATE_ENDED = 0;
const STATE_PLAYING = 1;
const STATE_PAUSED = 2;
const STATE_BUFFERING = 3;
const STATE_READY = 5;

function YoutubePlayer(props) {
  const playerRef = useRef(null);
  const prevPropsRef = useRef(props);
  
  const youtubeOptions = useMemo(() => ({
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
  }), [props.currentTime, props.muteOnStart, props.shouldPlay]);
  
  const handleReady = useCallback((e) => {
    playerRef.current = e.target;
  }, []);
  
  const handleStateChange = useCallback((e) => {
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
  }, [props.onPlayerStateChange, props.video_id]);
  
  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (playerRef.current) {
        const playerState = playerRef.current.getPlayerState();
        const isMuted = playerRef.current.isMuted();
        if (playerState === STATE_PLAYING) {
          const time = playerRef.current.getCurrentTime();
          if (time) {
            props.onPlayerTimeChange(Math.floor(time * 1000), isMuted);
          }
        }
      }
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [props.onPlayerTimeChange]);
  
  useEffect(() => {
    const player = playerRef.current;
    const prevProps = prevPropsRef.current;
    if (player) {
      if (props.currentTime !== prevProps.currentTime) {
        const curTime = player.getCurrentTime() * 1000;
        const videoDuration = player.getDuration() * 1000;
        const seekTarget = Math.min(props.currentTime, videoDuration - 1000);
        if (Math.abs(curTime - seekTarget) > 3000) {
          console.log(`${props.video_id} MUST SEEK: ${tsToVodTime(curTime)}->${tsToVodTime(seekTarget)} (${seekTarget - curTime}s)`, prevProps, props);
          player.seekTo(seekTarget / 1000, true);
        }
      }
      const playerState = player.getPlayerState();
      if (props.shouldPlay) {
        if (playerState !== STATE_PLAYING && playerState !== STATE_BUFFERING && playerState !== STATE_ENDED) {
          console.log(`${props.video_id} >  >  > Force play`);
          try {
            player.playVideo();
          }
          catch (e) {
            console.error('ERR');
          }
        }
      }
      else if (playerState === STATE_PLAYING) {
        console.log(`${props.video_id} || || || Force pause`);
        try {
          player.pauseVideo();
        }
        catch (e) {
          console.error('ERR');
        }
      }
    }
    prevPropsRef.current = props;
  }, [props]);
  
  return (
    <YouTube
      videoId={props.video_id}
      opts={youtubeOptions}
      iframeClassName="fullh"
      className="fullh"
      onPause={() => {
        console.log('PAUSE');
      }}
      onReady={handleReady}
      onStateChange={handleStateChange}
    />
  );
}

YoutubePlayer.propTypes = {
  video_id: PropTypes.string.isRequired,
  currentTime: PropTypes.number.isRequired,
  muteOnStart: PropTypes.bool,
  shouldPlay: PropTypes.bool,
  onPlayerStateChange: PropTypes.func,
  onPlayerTimeChange: PropTypes.func,
};

export { YoutubePlayer };
