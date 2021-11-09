import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';
import { VCenter } from 'xureact';
import Styled from 'styled-components';
import { setSubState } from '../state-util';
import { tsToTime } from '../time-util';
import { IconFastForward } from './icon-fast-forward';
import { IconVolumeOn } from './icon-volume-on';
import { TwitchPlayer } from './twitch-player';
import { YoutubePlayer } from './youtube-player';

let metaByVid = null;

class MultiPlayers extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    metaByVid: PropTypes.object.isRequired,
    onTimeUpdate: PropTypes.func.isRequired,
    onRemovePlayer: PropTypes.func.isRequired,
    streamers: PropTypes.arrayOf(PropTypes.object).isRequired,
    global_time: PropTypes.number.isRequired,
  };
  
  state = {
    ready: false,
    shouldPlay: false,
    players: [],
  };
  
  constructor(props) {
    super(props);
    metaByVid = props.metaByVid;
    this.handlePlayerStateChange = this.handlePlayerStateChange.bind(this);
    this.handlePlayerTimeChange = this.handlePlayerTimeChange.bind(this);
    this.handleFastForward = this.handleFastForward.bind(this);
  }
  
  initialPlayerState(streamer) {
    return {
      streamer: streamer,
      status: 'init',
      delay: 0,
      muted: true,
      syncing: false,
      ready: false,
    };
  }
  
  getMainIndex() {
    return this.props.streamers.findIndex(streamer => {
      return !!streamer.video_id;
    });
  }
  
  getVideoId(vodMeta) {
    if (vodMeta.permanent_id) {
      return vodMeta.permanent_id.id;
    }
    else {
      return vodMeta.id;
    }
  }
  
  componentDidMount() {
    this.rebuildPlayersState()
    .then(() => {
      this.setState(state => ({
        ...state,
        ready: true,
      }));
    });
  }

  //noinspection JSCheckFunctionSignatures
  componentDidUpdate(prevProps, prevState) {
    const props = this.props;
    if (!deepEqual(prevProps.streamers, props.streamers)) {
      this.rebuildPlayersState();
    }
  }
  
  areAllPlayersReady() {
    const state = this.state;
    return state.players.length > 0 && !(state.players.some(player => {
      return player.status === 'init' || player.status === 'starting' || player.status === 'Buffering';
    }));
  }
  
  /**
   * Rebuilds the state.players[] based on props.streamers[]
   */
  rebuildPlayersState() {
    return new Promise((resolve, reject) => {
      const props = this.props;
      this.setState(state => {
        const newPlayers = props.streamers.filter((player) => {
          return this.props.streamers.some(streamerLogin => player.streamer === streamerLogin);
        });
        this.props.streamers.forEach(streamerLogin => {
          if (!(newPlayers.some(player => player.streamer === streamerLogin))) {
            newPlayers.push(this.initialPlayerState(streamerLogin));
          }
        });
  
        console.log({
          ...state,
          players: newPlayers,
        })
        return {
          ...state,
          players: newPlayers,
        };
      }, resolve);
    });
  }
  
  render() {
    const props = this.props;
    const state = this.state;
    const nbPlayers = state.players.length;
    
    return (
      <div className={props.className}>
        {/*<div className="overlay">*/}
        {/*  <pre>{JSON.stringify(state, null, '  ')}</pre>*/}
        {/*</div>*/}
        <div className={`video-grid grid${nbPlayers}`}>
          {props.streamers.map((streamer, index) => {
            if (streamer.video_id && metaByVid[streamer.video_id]) {
              const videoMeta = metaByVid[streamer.video_id];
              let Player = TwitchPlayer; //index === 0 ? TwitchPlayer : MockPlayer;
              if (videoMeta.permanent_id && videoMeta.permanent_id.service === 'youtube') {
                Player = YoutubePlayer;
              }
              //const Player = MockPlayer; //index === 0 ? TwitchPlayer : MockPlayer;

              let expectedTime = props.global_time - videoMeta.createdTs/*+ player.delay*/;
              if (videoMeta.permanent_id && videoMeta.permanent_id.cut_start) {
                expectedTime += videoMeta.permanent_id.cut_start;
              }
              
              return state.ready && (
                <div key={streamer.streamerName} className={`multiplayers__player ${!state.players[index] || !state.players[index].muted ? '' : 'multiplayers__player-muted'}`}>
                  {this.renderPlayerOverlayControls(streamer, index)}
                  {(state.players[index] && !state.players[index].muted) && (
                    <div className="multiplayers__volume-on"><IconVolumeOn size={28} color="#fff"/></div>
                  )}
                  
                  <Player
                    key={streamer.video_id}
                    video_id={this.getVideoId(videoMeta)}
                    currentTime={expectedTime}
                    muteOnStart={index !== 0}
                    forceSource={videoMeta.permanent_id && videoMeta.permanent_id.force_source}
                    shouldPlay={state.shouldPlay}
                    onPlayerStateChange={playerState => this.handlePlayerStateChange(index, playerState)}
                    onPlayerTimeChange={(playerState, isMuted) => this.handlePlayerTimeChange(index, playerState, isMuted)}
                  />
                </div>
              );
            }
            else {
              const videoMeta = metaByVid[streamer.next_video_id];
              const nextVodTime = !videoMeta ? 0 : -Math.floor(props.global_time - videoMeta.createdTs);
              return (
                <div key={index} className="multiplayers__player multiplayers__player-muted multiplayers__player-offline">
                  {this.renderPlayerOverlayControls(streamer, index)}
                  <VCenter>
                    <div className="text-center">
                      <div className="text-big">{streamer.streamerName}</div>
                      <div className="text-big">OFFLINE</div>
                      <br/>
                      <div>Prochaine vidéo dans :</div>
                      <div className="clickable" data-time={nextVodTime} onClick={this.handleFastForward}>
                        {tsToTime(nextVodTime)} <IconFastForward color="#fff" size={18}/>
                      </div>
                    </div>
                  </VCenter>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  }
  
  renderPlayerOverlayControls(streamer, index) {
    const props = this.props;
    const state = this.state;
    return (
      <div className="multiplayers__player-overlay-controls">
        {/*<button className="multiplayers__resync-button" onClick={() => {*/}
        {/*  //TODO Resync button*/}
        {/*  console.error('TODO Resync button');*/}
        {/*}}>*/}
        {/*  Resync*/}
        {/*</button>*/}
        {/*<input type="number" step={0.1} value={state.players[index].delay/1000.0} onChange={(e) => {*/}
        {/*  console.log(index);*/}
        {/*  this.setState(setSubState('players', index, player => ({*/}
        {/*    ...player,*/}
        {/*    delay: e.target.value*1000,*/}
        {/*  })));*/}
        {/*}}/>*/}
        {streamer.video_id && (
          <span>
            {streamer.video_id}
          </span>
        )}
        {' '}
        <button className="multiplayers__close-button" onClick={() => {
          props.onRemovePlayer(streamer.streamerName);
        }}>×</button>
      </div>
    );
  }
  
  handlePlayerStateChange(index, playerState) {
    const props = this.props;
    
    this.setState(prevState => {
      const state = setSubState('players', index, player => {
        return {
          ...player,
          status: playerState,
        };
      })(prevState);
  
      if (playerState !== 'Ended') {
        state.shouldPlay = (playerState === 'Playing' || playerState === 'Buffering');
      }
      
      return state;
    });
  }
  
  handlePlayerTimeChange(index, playerTime, isMuted) {
    const props = this.props;
    const state = this.state;
    const mainIndex = this.getMainIndex();
    if (mainIndex === index) {
      const videoMeta = metaByVid[this.props.streamers[index].video_id];
      let global_time = videoMeta.createdTs + playerTime;
      if (videoMeta.permanent_id && videoMeta.permanent_id.cut_start) {
        global_time -= videoMeta.permanent_id.cut_start;
      }
      if (props.global_time !== global_time) {
        this.props.onTimeUpdate(global_time);
      }
    }
    if (state.players[index].muted !== isMuted) {
      console.log("CHANGE MUTED");
      this.setState(setSubState('players', index, player => ({
        ...player,
        muted: isMuted,
      })));
    }
  }
  
  handleFastForward(e) {
    const time = parseInt(e.currentTarget.getAttribute('data-time'));
    this.props.onTimeUpdate(this.props.global_time+time);
  }
  
  shouldComponentUpdate(nextProps, nextState) {
      return !deepEqual(this.props, nextProps) || !deepEqual(this.state, nextState);
  }
}

//language=SCSS
MultiPlayers = Styled(MultiPlayers)`
& {
  display: block;
  height: 100%;

  .overlay {
    position: absolute;
    top: 0;
    width: 100%;
    height: 250px;
    background: #333;
    overflow: scroll;
  }
  
  .multiplayers__player {
    position: relative;
    //border: solid 1px #418033;
    &:hover {
      .multiplayers__volume-on {
        opacity: 0.0;
      }
    }
  }
  
  .multiplayers__volume-on {
    position: absolute;
    bottom: 10px;
    left: 15px;
    opacity: 0.68;
    pointer-events: none;
  }

  .multiplayers__player-overlay-globaltime {
    position: absolute;
    top: 0;
    left: 3px;
    text-shadow: 0 0 2px #111;
  }
  
  .multiplayers__player-overlay-controls {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 50;
    padding: 3px 5px;
    //background: #313335;
    text-align: right;
    visibility: hidden;
  }
  .multiplayers__player:hover .multiplayers__player-overlay-controls {
    visibility: visible;
  }
  
  .video-grid {
    display: grid;
    height: 100%;
    &.grid1 {
      grid-template-columns: repeat(1, 1fr);
    }
    &.grid2, &.grid3, &.grid4  {
      grid-template-columns: 1fr 1fr;
    }
    &.grid5, &.grid6, &.grid7, &.grid8, &.grid9  {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
  
  .multiplayers__player-offline {
    text-shadow: 0 0 5px #000, -1px 0 1px ${props => props.config.colorPalette.common.primary};
    background: ${props => props.config.offlineBackgroundColor || 'none'};
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      background-image: ${props => `url(${props.config.offlineBackgroundImage})` || 'none'};
    }
  }
  
  .text-big {
    font-size: 25px;
  }
}
`;

export { MultiPlayers };
