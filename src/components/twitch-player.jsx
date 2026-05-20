import React, {useEffect, useMemo, useState} from 'react'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql'; //eslint-disable-line no-unused-vars
import { tsToVodTime } from '../time-util.js';

const Twitch = globalThis.Twitch;

// type TwitchPlayerProps = {
//   video_id: string,
//   currentTime: number,
//   forceSource?: boolean,
//   muteOnStart?: boolean,
//   shouldPlay?: boolean,
//   onPlayerStateChange?: (state: string) => void,
//   onPlayerTimeChange?: (time: number, muted: boolean) => void,
// };

function TwitchPlayer(props/*: TwitchPlayerProps*/) {
  const embedId = useMemo(() => `twitch-player-${Math.floor(Math.random()*100000)}`, []);
  
  const currentTime = props.currentTime < 1000 ? 1000 : props.currentTime;
  const options = {
    width: '100%',
    height: '100%',
    video: props.video_id,
    autoplay: props.shouldPlay,
    muted: props.muteOnStart,
    time: tsToVodTime(currentTime),
  };

  const [player, setPlayer] = useState(null);
  
  const handleEventEnded = () => {
    if (props.onEnded) {
      props.onEnded();
    }
  }
  
  useEffect(() => {
    console.log('DID MOUNT');
    let vendorReady = false;
    let prevPlayerState = null;
    let ready = false;
    
    const handleEventUpdateState = (_playerState) => {
      const playerState = {
        currentTime: Math.floor(_playerState.currentTime*100)/100.0,
        ended: _playerState.ended,
        muted: _playerState.muted,
        playback: _playerState.playback,
        qualitiesAvailable: _playerState.qualitiesAvailable,
      };
  
      //console.log(!!player, vendorReady);
      if (!player || !vendorReady) {
        return;
      }
      
      if (!deepEqual(prevPlayerState, playerState)) {
        //console.log(playerState, prevPlayerState);
        if (!ready) {
          //console.log('not ready');
          if (playerState.playback === 'Ready' && playerState.qualitiesAvailable && playerState.qualitiesAvailable.length > 0) {
            if (props.forceSource) {
              player.setQuality('chunked');
            }
            else {
              const qualities = player.getQualities();
              const bestCleanQuality = qualities.filter(q => q.group!=='auto' && q.group!=='chunked')[0];
              if (bestCleanQuality) {
                player.setQuality(bestCleanQuality.group);
              }
              else {
                player.setQuality('chunked');
              }
            }
            ready = true;
          }
        }
        else {
          //console.log(playerState);
          if (prevPlayerState.playback !== playerState.playback) {
            props.onPlayerStateChange(playerState.playback);
          }
  
          const time = playerState.currentTime * 1000;
          if (time !== player.getCurrentTime()*1000) {
            console.log(`${tsToVodTime(time)} vs ${tsToVodTime(player.getCurrentTime()*1000)}`);
            console.log(`${(time)} vs ${(player.getCurrentTime()*1000)}`);
          }
  
          if (
            prevPlayerState.currentTime !== playerState.currentTime
            && (playerState.playback === 'Playing' || playerState.playback === 'Buffering')
          ) {
            props.onPlayerTimeChange(Math.floor(playerState.currentTime*1000), player.getMuted());
          }
        }
        
        //console.log('-->', playerState);
        prevPlayerState = playerState;
      }
    }
    
    const player = new Twitch.Embed(embedId, options);
    setPlayer(player);
    player.addEventListener(Twitch.Player.VIDEO_READY, () => {
      console.log('VIDEO_READY');
      vendorReady = true;
      if (props.onReady) {
        props.onReady();
      }
    });
    player.addEventListener(Twitch.Player.ENDED, handleEventEnded);
    player.addEventListener('UPDATE_STATE', handleEventUpdateState);
    /*player.addEventListener('video.ready', () => {
      console.log('VIDEO_READY');
      setVendorReady(true);
    });*/

    return () => {
      player.removeEventListener(Twitch.Player.VIDEO_READY);
      player.removeEventListener(Twitch.Player.ENDED);
      player.removeEventListener('UPDATE_STATE');
      player.destroy();
      setPlayer(null);
      //player = null;
    }
  }, []);
  
  useEffect(() => {
    if (player) {
      player.pause();
      player.setVideo(props.video_id, Math.floor(props.startAt));
    }
  }, [player, props.video_id]);
  
  useEffect(() => {
    if (player) {
      const curTime = player.getCurrentTime() * 1000;
      if (Math.abs(curTime - props.currentTime) > 3000) {
        //console.log(`${props.video_id} MUST SEEK: ${tsToVodTime(curTime)}->${tsToVodTime(props.currentTime)} (${props.currentTime - curTime}s)`, prevProps, props);
        player.seek(props.currentTime / 1000);
      }
    }
  }, [player, props.currentTime])
  
  useEffect(() => {
    if (player) {
      if (props.shouldPlay) {
        if (player.isPaused()) {
          console.log(` >  >  > Force play`);
          player.play();
        }
      }
      else {
        if (!player.isPaused()) {
          console.log(` || || || Force pause`);
          player.pause();
        }
      }
    }
  }, [player, props.shouldPlay]);

  return (
    <div id={embedId} style={{height: '100%', visibility: 'visible'}}/>
  );
}

export { TwitchPlayer };
