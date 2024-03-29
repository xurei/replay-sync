import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import { FlexLayout, FlexChild } from 'xureact/lib/module/components/layout/flex-layout';
import Styled from 'styled-components';
import { zonedTimeToUtc } from 'date-fns-tz';
import { setDayOfYear } from 'date-fns';
import { MultiPlayers } from './components/multi-players';
import { MultiTimelines } from './components/multi-timelines';
import { OverlaySelectStreamer } from './components/overlay-select-streamer';
import { OverlayThanks } from './components/overlay-thanks';
import { OverlayChangelog } from './components/overlay-changelog';
import { IconShare } from './components/icon-share';
import { OverlayShare } from './components/overlay-share';
import { IconCalendar } from './components/icon-calendar';
import { IconDonate } from './components/icon-donate';
import { IconGift } from './components/icon-gift';
import { OverlayDonate } from './components/overlay-donate';
import { formatDateTimeSeconds, formatFullTime, getDayOfYear } from './date-util';
import { hasNewVersion, setLastVersionVisited } from './version';
import { EventsPanel } from './components/events-panel';

import { style } from './App.css.js';

let metaByStreamer = null;

function findMatchingVOD(streamerName, global_time) {
  if (metaByStreamer[streamerName]) {
    const meta = Object.values(metaByStreamer[streamerName]);
    for (const vod of meta) {
      const createdTs = vod.createdTs;
      if (createdTs <= global_time && global_time <= createdTs + vod.duration_ms - 3000) {
        let vid = vod.id;
        if (vod.permanent_id) {
          vid = `${vod.permanent_id.id}<${vid}`;
        }
        return vid;
      }
    }
  }
  return null;
}
function findNextVOD(streamerName, global_time) {
  const meta = Object.values(metaByStreamer[streamerName]);
  meta.sort((a,b) => {
    return a.createdTs - b.createdTs;
  });
  for (const vod of meta) {
    const createdTs = vod.createdTs;
    if (createdTs > global_time) {
      let vid = vod.id;
      if (vod.permanent_id) {
        vid = `${vod.permanent_id.id}<${vid}`;
      }
      return vid;
    }
  }
  return null;
}

class PlayerView extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    metaByStreamer: PropTypes.object.isRequired,
    metaByVid: PropTypes.object.isRequired,
    events: PropTypes.array.isRequired,
  };
  
  multiplayersRef = React.createRef();
  
  state = {
    global_time: null,
    switching: false,
    thanksShown: false,
    changelogShown: false,
    shareShown: false,
    donateShown: false,
    shareLink: '',
    selectStreamerShown: false,
    eventsPanelShown: false,
    streamers: [
      //"bagherajones",
      //"horty_",
    ],
  };
  
  get anyOverlayShown() {
    return (
      this.state.thanksShown ||
      this.state.changelogShown ||
      this.state.shareShown ||
      this.state.donateShown ||
      this.state.selectStreamerShown
    );
  }
  
  constructor(props) {
    super(props);
    metaByStreamer = props.metaByStreamer;
    this.initialDayOfYear = getDayOfYear(props.config.timeFrames[0].startTimestamp);
    this.state.global_time = props.config.timeFrames[0].startTimestamp;
    this.handleRemovePlayer = this.handleRemovePlayer.bind(this);
    this.handleAddStreamer = this.handleAddStreamer.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleShareClick = this.handleShareClick.bind(this);
    this.handleDonateClick = this.handleDonateClick.bind(this);
    this.handleChangelogClick = this.handleChangelogClick.bind(this);
    this.handleThanksClick = this.handleThanksClick.bind(this);
    this.handleToggleStreamerVisibility = this.handleToggleStreamerVisibility.bind(this);
    this.handleShowEventsPanel = this.handleShowEventsPanel.bind(this);
    this.handleSelectEvent = this.handleSelectEvent.bind(this);
  }
  
  componentDidMount() {
    this.parseShareLink();
    global.addEventListener('keydown', e => {
      if(e.which === 27) {
        this.setState(state => ({
          ...state,
          thanksShown: false,
          changelogShown: false,
          donateShown: false,
          shareShown: false
        }));
      }
    })
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    const state = this.state;
    let date = new Date(state.global_time);
    const strDate = `J${getDayOfYear(date)-this.initialDayOfYear+1}T${formatFullTime(date)}`;
    //strDate.substring(0, strDate.length-5)+'Z';
    //document.location.hash = `${strDate}&${state.streamers.join(',')}`;
  }
  
  createStreamerObj(streamerName) {
    return {
      name: streamerName,
      visible: true,
    };
  }
  
  parseShareLink() {
    const hash = document.location.hash.substr(1).split('&');
  
    // J115T01:13:11 => 2021-04-23T12:34:56+02:00
    if (hash.length >= 2) {
      try {
        const targetStreamers = hash[1].split(':').filter(streamer => metaByStreamer[streamer]).map(this.createStreamerObj);
        this.setState(state => ({
          ...state,
          global_time: parseInt(hash[0])*1000,
          streamers: targetStreamers,
          selectStreamerShown: false,
          changelogShown: false,
        }), () => {
          //this.multiplayersRef.current.gotoTime(targetTs);
        });
      }
      catch (e) {
        console.error(e);
      }
    }
  }
  
  buildShareLink() {
    const state = this.state;
    const location = document.location;
    const port = (location.port && location.port !== '' && location.port !== 80 && location.port !== 443) ? `:${location.port}` : '';
    const baseUrl = `${location.protocol}//${location.hostname}${port}${location.pathname}`;
    
    const streamers = state.streamers.map(streamer=>streamer.name).join(':');
    const dateOfEvent = Math.floor(state.global_time / 1000);
    
    return `${baseUrl}#${dateOfEvent}&${streamers}`;
  }
  
  render() {
    const props = this.props;
    const state = this.state;
    
    //const streamerLogins = Object.keys(allmeta);
    //const ytVideoId = allmeta[state.main_streamer][state.main_video_id].ytid;
    //const twVideoId = state.main_video_id;
  
    const streamers = state.streamers.filter(streamer => streamer.visible).map(streamer => {
      return {
        streamerName: streamer.name,
        video_id: findMatchingVOD(streamer.name, state.global_time),
        next_video_id: findNextVOD(streamer.name, state.global_time),
      }
    });
    
    return (
      <div className={props.className}>
        <style>{style}</style>
        <div style={{ height: '100vh', width: '100vw'}}>
          {state.thanksShown && (
            <OverlayThanks onClose={() => this.setState(state => ({...state, thanksShown: false}))}/>
          )}
          {state.donateShown && (
            <OverlayDonate config={props.config} onClose={() => this.setState(state => ({...state, donateShown: false}))}/>
          )}
          {(state.selectStreamerShown && !state.changelogShown && !state.donateShown) && (
            <OverlaySelectStreamer
              config={props.config}
              streamersObj={props.streamersObj}
              metaByStreamer={metaByStreamer}
              meta
              selectedStreamers={state.streamers.map(streamer=>streamer.name)}
              onSelect={(streamerLogin) => {
                this.setState(state => {
                  const newStreamers = state.streamers.slice();
                  newStreamers.push(this.createStreamerObj(streamerLogin));
                  return {
                    ...state,
                    streamers: newStreamers,
                    selectStreamerShown: false,
                  };
                });
              }}
              onClose={state.streamers.length === 0 ? null : () => {
                this.setState(state => ({
                  ...state,
                  selectStreamerShown: false,
                }))
              }}
            />
          )}
          {state.changelogShown && (
            <OverlayChangelog config={props.config} onClose={() => this.setState(state => ({...state, changelogShown: false}))}/>
          )}
          {state.shareShown && (
            <OverlayShare link={state.shareLink} onClose={() => this.setState(state => ({...state, shareShown: false}))}/>
          )}
          <FlexLayout direction="column">
            <FlexChild height={1} grow={3}>
              <FlexLayout direction="row">
                <FlexChild width={48} grow={0}>
                  <div className="player-view__logo-wrapper">
                    <img src={props.config.logo.size64} alt={props.config.appName} width={32} height={32}/>
                  </div>
                  {!this.anyOverlayShown && (
                    <div className="player-view__controls__buttons">
                      <button onClick={this.handleShareClick} style={{fontSize: 16, lineHeight: '20px', paddingTop: 7}}>
                        <IconShare size={20} color="inherit"/>
                        <div className="player-view__controls__button-text">Lien de partage</div>
                      </button>
                      <button className={`${hasNewVersion() ? 'new-version' : ''}`} onClick={this.handleChangelogClick} style={{fontSize: 16, lineHeight: '20px', paddingTop: 7}}>
                        <IconGift className="gift" size={20} color="inherit"/>
                        <div className="player-view__controls__button-text">Notes de version</div>
                      </button>
                      <button onClick={this.handleDonateClick} style={{fontSize: 16, lineHeight: '22px', paddingTop: 7}}>
                        <IconDonate size={22} color="inherit"/>
                        <div className="player-view__controls__button-text">Soutenir le projet</div>
                      </button>
                      {props.config.hasEvents && (
                        <button onClick={this.handleShowEventsPanel} style={{fontSize: 16, lineHeight: '22px', paddingTop: 7}}>
                          <IconCalendar size={22} color={state.eventsPanelShown ? props.config.colorPalette.common.primary : 'inherit'}/>
                          <div className="player-view__controls__button-text">Évènements</div>
                        </button>
                      )}
                      {/*<button onClick={this.handleThanksClick} style={{fontSize: 20}}>*/}
                      {/*  ♥*/}
                      {/*</button>*/}
                    </div>
                  )}
                </FlexChild>
                <FlexChild grow={1} width={1}>
                  <div className="fullh">
                    {props.config.hasEvents && state.eventsPanelShown && (
                      <EventsPanel config={props.config} events={props.events} onSelectEvent={this.handleSelectEvent}/>
                    )}
                    {state.streamers.length === 0 ? (
                      <div className="empty-view fullw fullh">
                        {props.config.hasEvents && (
                          <div className="empty-view__select-event">
                            ⬅ Clique ici pour choisir un évènement
                          </div>
                        )}
                        <div className="empty-view__add-streamer">
                          Clique ici pour ajouter un streamer<br/>
                          <span style={{display: 'inline-block', width: 65}}> </span>⬇
                        </div>
                      </div>
                    ) : (
                      <MultiPlayers
                        config={props.config}
                        metaByVid={props.metaByVid}
                        ref={this.multiplayersRef}
                        global_time={state.global_time}
                        streamers={streamers}
                        onTimeUpdate={time => this.setState(state => {
                          return ({
                            ...state,
                            global_time: time,
                          });
                        })}
                        onRemovePlayer={this.handleRemovePlayer}
                      />
                    )}
                  </div>
                </FlexChild>
              </FlexLayout>
            </FlexChild>
            <FlexChild grow={0} height={20}>
              <div className="text-center">
                <div className="player-view__global-time">
                  {formatDateTimeSeconds(state.global_time)}
                </div>
              </div>
            </FlexChild>
            <FlexChild grow={0}>
              <div className="player-view__controls">
                <FlexLayout direction="row">
                  <FlexChild width={1} grow={1}>
                    <MultiTimelines
                      config={props.config}
                      streamersObj={props.streamersObj}
                      metaByStreamer={props.metaByStreamer}
                      time={state.global_time}
                      streamers={state.streamers}
                      onTimeChange={this.handleTimeChange}
                      onRemoveStreamer={this.handleRemovePlayer}
                      onToggleStreamerVisibility={this.handleToggleStreamerVisibility}
                      onAddStreamer={this.handleAddStreamer}
                    />
                  </FlexChild>
                </FlexLayout>
              </div>
            </FlexChild>
          </FlexLayout>
        </div>
      </div>
    );
  }
  
  handleAddStreamer() {
    this.setState(state => ({
      ...state,
      selectStreamerShown: true,
    }));
  }
  
  handleRemovePlayer(streamerToRemove) {
    this.setState(state => {
      return {
        ...state,
        streamers: state.streamers.filter(streamer => streamer.name !== streamerToRemove)
      };
    });
  }
  
  handleTimeChange(targetTime) {
    this.setState(state => ({
      ...state,
      global_time: targetTime,
    }));
  }
  
  handleShowEventsPanel() {
    this.setState(state => ({
      ...state,
      eventsPanelShown: !state.eventsPanelShown,
    }));
  }
  
  handleSelectEvent(eventData) {
    const channels = eventData.channels.slice(0, Math.min(eventData.channels.length, 5));
    console.log(channels);
    this.setState(state => ({
      ...state,
      eventsPanelShown: false,
      global_time: eventData.timestamp*1000,
      streamers: channels.map(chan => ({
        name: chan.id, visible: true,
      })),
    }));
  }
  
  handleToggleStreamerVisibility(streamerToToggle) {
    this.setState(state => {
      return {
        ...state,
        streamers: state.streamers.map(streamer => {
          if (streamer.name !== streamerToToggle) {
            return streamer;
          }
          else {
            return {
              ...streamer,
              visible: !streamer.visible,
            };
          }
        })
      };
    });
  }
  
  handleThanksClick() {
    this.setState(state => ({
      ...state,
      thanksShown: true,
    }));
  }
  
  handleChangelogClick() {
    setLastVersionVisited();
    this.setState(state => ({
      ...state,
      changelogShown: true,
    }));
  }
  
  handleShareClick() {
    this.setState(state => ({
      ...state,
      shareShown: true,
      shareLink: this.buildShareLink(),
    }));
  }
  
  handleDonateClick() {
    this.setState(state => ({
      ...state,
      donateShown: true,
    }));
  }
}

//language=SCSS
PlayerView = Styled(PlayerView)`
& {
  iframe {
    height: 100%;
  }
  
  a {
    color: ${props => props.config.colorPalette.common.primary};
  }

  input[type="text"]:focus {
    outline: none;
    border-color: ${props => props.config.colorPalette.common.primary};
  }
  
  .player-view__controls {
    padding: 0;
  }
  
  .player-view__global-time {
    font-size: 14.8px;
    line-height: 18px;
  }
  
  .player-view__logo-wrapper {
    text-align: center;
    padding-top: 8px;
  }
  
  .player-view__controls__buttons {
    padding: 15px 0 0 0;
    text-align: right;
    background: #0E0E10;
    position: relative;
    button {
      width: 40px;
      height: 40px;
      margin: 0 auto;
      line-height: 10px;
      text-align: center;
      padding-left: 0;
      padding-right: 0;
      vertical-align: top;
      border-radius: 0;
      position: relative;
      display: block;
      background: none;
      border: none;
      
      .player-view__controls__button-text {
        display: none;
        position: absolute;
        background: #0E0E10;
        color: #ccc;
        border: solid 1px ${props => props.config.colorPalette.button.background};
        border-radius: 3px;
        padding: 3px 8px;
        z-index: 10;
        white-space: nowrap;
        top: 3px;
        left: 40px;
        opacity: 0.9;
        &:before {
          content : "";
          width: 1px;
          height: 1px;
          position: absolute;
          top: 8px;
          left: -12px;
          border: solid 5px transparent;
          border-right-color: ${props => props.config.colorPalette.button.background};
        }
      }
      
      fill: #bbb;
      &:hover {
        fill: ${props => props.config.colorPalette.button.background};
        border: none;
      
        &:before {
          content: "";
        }
        .player-view__controls__button-text {
          display: block;
        }
      }

      //&:first-child {
      //  border-radius: 3px 0 0 3px;
      //}
      //&:last-child {
      //  border-radius: 0 3px 3px 0;
      //}
      //&:not(:last-child):not(:hover):after {
      //  content: "";
      //  position: absolute;
      //  display: block;
      //  top: 0;
      //  right: 0;
      //  width: 1px;
      //  height: 100%;
      //  background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 33%, rgba(0,0,0,0.1) 66%, rgba(0,0,0,0) 100%);
      //}
    }
  }
  
  button {
    padding: 10px 14px;
    background: ${props => props.config.colorPalette.button.background};
    border: solid 1px ${props => props.config.colorPalette.button.border};
    color: ${props => props.config.colorPalette.button.textColor};
    border-radius: 3px;
    cursor: pointer;
  
    &:hover {
      border: solid 1px ${props => props.config.colorPalette.button.hoverBorder};
    }
    &:active {
      border-bottom: none;
      border-top-width: 2px;
      border-top-color: ${props => props.config.colorPalette.button.activeBorder};
    }
    &:disabled {
      border-color: ${props => props.config.colorPalette.button.disabledBorder};
      background: ${props => props.config.colorPalette.button.disabledBackground};
    }
    &.compact {
      padding: 5px 7px;
    }
  }
  
  .new-version {
    background: ${props => props.config.colorPalette.newVersionButton.background};
    border-color: ${props => props.config.colorPalette.newVersionButton.border};
    &:hover {
      border: solid 1px ${props => props.config.colorPalette.newVersionButton.hoverBorder};
    }
    
    .gift {
      will-change: transform;
      animation: gift-new-version;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }
  }

  .empty-view {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: ${props => `url(${props.config.offlineBackgroundImage})` || 'none'};
  }
  
  .empty-view__select-event {
    position: absolute;
    top: 190px;
  }
  
  .empty-view__add-streamer {
    position: absolute;
    bottom: 0;
  }
}

@keyframes gift-new-version {
  0%   { transform: rotate(0deg);  }
  25%  { transform: rotate(10deg) scale(1.05); }
  50%  { transform: rotate(0deg) scale(1.1);   }
  75%  { transform: rotate(10deg) scale(1.05); }
  100%  { transform: rotate(0deg); }
}
`;

export { PlayerView };
