import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';
import Styled from 'styled-components';
import { Timeline } from './timeline';

import { FlexChild, FlexLayout } from 'xureact/lib/module/components/layout/flex-layout';
import { DayBlocks } from './day-blocks';
import { IconEyeClosed } from './icon-eye-closed';
import { IconEyeOpen } from './icon-eye-open';
import { mergeTimelines } from '../timelines-util';
import { formatFullTime } from '../date-util';

const zoomDecrement = 0.8;
const maxZoom = 1/Math.pow(zoomDecrement, 17);

let metaByStreamer = null;
let streamersObj = null;

function noop() {}

class MultiTimelines extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    streamersObj: PropTypes.object.isRequired,
    metaByStreamer: PropTypes.object.isRequired,
    time: PropTypes.number.isRequired,
    streamers: PropTypes.array.isRequired,
    onTimeChange: PropTypes.func.isRequired,
    onAddStreamer: PropTypes.func.isRequired,
    onRemoveStreamer: PropTypes.func.isRequired,
    statsMode: PropTypes.bool,
    debugMode: PropTypes.bool,
  };
  
  state = {
    cursorPosition: 0,
    zoom: 1,
    horizontalScroll: 0,
    visible: true,
  };
  
  streamerNames = [];
  everyoneVideos = [];
  
  get totalLength() {
    const props = this.props;
    return props.config.endTimestamp - props.config.startTimestamp;
  }
  
  constructor(props) {
    super(props);
    metaByStreamer = props.metaByStreamer;
    streamersObj = props.streamersObj;
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleVisibilityToggle = this.handleVisibilityToggle.bind(this);
  
    this.streamerNames = props.streamers.map(s => s.name);
    this.everyoneVideos = mergeTimelines(metaByStreamer, this.streamerNames);
  }
  
  componentWillUpdate(prevProps, prevState, snapshot) {
    const props = this.props;
    const streamerNames = props.streamers.map(s => s.name);
    if (!deepEqual(streamerNames, this.streamerNames)) {
      this.streamerNames = streamerNames;
      this.everyoneVideos = mergeTimelines(metaByStreamer, this.streamerNames);
    }
  }
  
  render() {
    const props = this.props;
    const state = this.state;
    return (
      <div className={`${props.className} ${props.statsMode ? 'stats-mode' : ''}`}>
        <FlexLayout direction="row">
          <FlexChild grow={0} style={{zIndex: 2}} className="multitimeline__left-pane">
            <div className="text-right dark-bg multitimeline__control-buttons">
              <span>
                <button className={`compact multitimeline__toggle-timelines ${state.visible ? '' : 'hidden'}`} onClick={this.handleVisibilityToggle}>
                </button>
                <span style={{display: 'inline-block', width: 1}}/>
              </span>
              {props.streamers.length < 9 && (
                <span>
                  <button className="compact" onClick={props.onAddStreamer}>+ Streamer</button>
                  <span style={{display: 'inline-block', width: 4}}/>
                </span>
              )}
            </div>
            <div className={`text-right dark-bg multitimeline__collapsable ${state.visible ? '' : 'hidden'}`}>
              {props.streamers.map(streamer => (
                <div key={streamer.name} className="multitimeline__streamer-name">
                  {props.statsMode ? (
                    <a href={`https://www.twitch.tv/${streamer.name}/videos?category=32982&filter=highlights`} target="_blank"
                    className={`multitimeline__streamer-name ${streamersObj[streamer.name].confirmed ? 'confirmed' : ''}`}>
                      {streamer.name}
                    </a>
                  ) : (
                    <span>
                      {streamer.name}
                      <button className="multitimeline__visible-button" onClick={() => props.onToggleStreamerVisibility(streamer.name)}>
                        {streamer.visible ? (
                          <IconEyeOpen color="#cccccc" size={14}/>
                        ) : (
                          <IconEyeClosed color="#cccccc" size={14}/>
                        )}
                      </button>
                      {' '}
                      <button className="multitimeline__remove-button" onClick={() => props.onRemoveStreamer(streamer.name)}>
                      −
                      </button>
                    </span>
                  )}
                  
                </div>
              ))}
            </div>
          </FlexChild>
          
          <FlexChild width={1} grow={1} style={{zIndex: 1}}>
            <div className="prel" style={{width: `${100*state.zoom}%`, height: '100%', left: `-${state.horizontalScroll*100}%`}}>
              <div className="multitimeline__days">
                {this.renderDays()}
              </div>
  
              <div className="prel">
                {!props.statsMode && (
                  <div className={`multitimeline__everyone-timeline ${state.visible ? '' : 'hidden'}`}>
                    {this.streamerNames.length > 0 && (
                      <Timeline
                        config={props.config}
                        key={'everyone'}
                        vods={this.everyoneVideos}
                        time={props.time}
                        onRemoveStreamer={noop}/>
                    )}
                  </div>
                )}
                <div className={`multitimeline__streamer-timelines multitimeline__collapsable ${state.visible ? '' : 'hidden'}`}>
                  {props.streamers.map(streamer => {
                    return (
                      <Timeline
                        config={props.config}
                        key={streamer.name}
                        statsMode={props.statsMode || props.debugMode}
                        disabled={!streamer.visible}
                        vods={metaByStreamer[streamer.name]}
                        time={props.time}
                        onRemoveStreamer={props.onRemoveStreamer}/>
                    )
                  })}
                </div>
              </div>
              
              {!props.statsMode && (
                <div className="multitimeline__select-overlay">
                  <div className="multitimeline__select-overlay-content" onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut} onClick={this.handleClick} onWheel={this.handleWheel}>
                    {this.renderCurrentTime()}
                    {this.renderSelectTime()}
                  </div>
                </div>
              )}
            </div>
          </FlexChild>
        </FlexLayout>
      </div>
    );
  }
  
  renderCurrentTime() {
    const props = this.props;
    return (
      <div className="multitimeline__time-bar current" style={{
        left: `${(props.time-props.config.startTimestamp)*100 / this.totalLength}%`,
      }}/>
    );
  }
  
  renderSelectTime() {
    const props = this.props;
    const state = this.state;
    
    if (!state.cursorPosition) {
      return null;
    }
    else {
      const selectTime = this.getTargetTime(state.cursorPosition);
      return (
        <div className="multitimeline__time-bar select" style={{
          left: `${(selectTime-props.config.startTimestamp)*100 / this.totalLength}%`,
        }}>
          <div className={`select-timecode ${state.cursorPosition > 0.9 ? 'select-timecode__right' : 'select-timecode__left'}`}>{formatFullTime(selectTime)}</div>
        </div>
      );
    }
  }
  
  renderDays() {
    const props = this.props;
    const daysContents = [];
    let i = 1;
    
    const nbDays = (props.config.endTimestamp - props.config.startTimestamp) / (1000*3600*24);
    const dayLabel = nbDays < 30 ? 'Jour ' : 'J' ;
    
    for (let time=props.config.startTimestamp; time <= props.config.endTimestamp; time += 1000*3600*24) {
      daysContents.push(<div className="multitimeline__day-block text-center">
        {dayLabel}{i}
      </div>);
      i++;
    }
    
    return (
      <DayBlocks config={props.config} contents={daysContents} height={30} />
    );
  }
  
  getPosition(e) {
    const boundingRect = e.target.parentNode.getBoundingClientRect();
    const x = e.clientX - boundingRect.left;
    const width = boundingRect.width;
    return x/width;
  }
  
  getTargetTime(ratio) {
    const props = this.props;
    return ratio * this.totalLength + props.config.startTimestamp;
  }
  
  handleVisibilityToggle(e)  {
    this.setState(state => ({
      ...state,
      visible: !state.visible,
    }));
  }
  
  handleMouseOut(e) {
    this.setState(state => ({
      ...state,
      cursorPosition: 0,
    }));
  }
  
  handleMouseMove(e) {
    const ratio = this.getPosition(e);
    this.setState(state => ({
      ...state,
      cursorPosition: ratio,
    }));
  }
  
  handleWheel(e) {
    const delta = e.deltaY;
    //console.log(`wheel ${delta}`);
    const zoomDirection = delta > 0 ? zoomDecrement : 1/zoomDecrement;
    this.setState(state => {
      const newZoom = Math.min(maxZoom, Math.max(1, state.zoom * zoomDirection));
      const addedWidth = newZoom - state.zoom;
      const newHorizontalScroll = (newZoom === 1) ? 0 : state.horizontalScroll + state.cursorPosition*addedWidth;
      //console.log('cursor pos', state.cursorPosition);
      return {
        ...state,
        zoom: newZoom,
        horizontalScroll: newHorizontalScroll,
      };
    });
  }
  
  handleClick(e) {
    const ratio = this.getPosition(e);
    const targetTime = this.getTargetTime(ratio);
    if (this.props.onTimeChange) {
      this.props.onTimeChange(targetTime);
    }
  }
  
  shouldComponentUpdate(nextProps, nextState) {
      return !deepEqual(this.props, nextProps) || !deepEqual(this.state, nextState);
  }
}
//language=SCSS
MultiTimelines = Styled(MultiTimelines)`
  & {
    position: relative;
    padding-bottom: 5px;

    .multitimeline__left-pane {
      position: relative;
      z-index: 99;
      background: #0E0E10;
      padding-bottom: 3px;
      width: 160px;
    }

    .multitimeline__days {
      position: relative;
      z-index: 1;
      height: 30px;
    }

    .multitimeline__everyone-timeline {
      position: relative;
      height: 20px;
      width: 100%;
      z-index: 1;
    }

    .multitimeline__streamer-timelines {
      position: absolute;
      z-index: 2;
      width: 100%;
      top: 0;
    }

    .multitimeline__control-buttons {
      z-index: 2;
      height: 34px;

      button {
        vertical-align: top;
      }
    }

    .multitimeline__toggle-timelines {
      padding-top: 12px !important;

      &:before {
        content: "⌃";
      }

      &:hover {
        padding-top: 0 !important;
        padding-bottom: 10px !important;

        &:before {
          content: "⌄";
        }
      }

      font-size: 28px;
      line-height: 20px;

      &.hidden {
        padding-top: 0 !important;
        padding-bottom: 10px !important;

        &:before {
          content: "⌄";
        }

        &:hover {
          padding-top: 12px !important;
          padding-bottom: 5px !important;

          :before {
            content: "⌃";
          }
        }
      }

      background: none !important;
      border: none !important;
    }

    .multitimeline__remove-button, .multitimeline__visible-button {
      height: 14px;
      width: 14px;
      padding: 1px;
      color: #111;
      vertical-align: top;
      position: relative;
      top: -4px;
      border: none;
      margin-left: 3px;
      font-weight: 700;

      &:hover {
        border: none;
      }
    }

    .multitimeline__remove-button {
      line-height: 6.5px;
      background: #888;

      &:hover {
        background: #FF7E56;
      }
    }

    .multitimeline__visible-button {
      line-height: 5px;
      background: none;
    }

    &:not(.stats-mode) .multitimeline__collapsable {
      max-height: 180px;
      transition: max-height 0.3s ease-out;
      overflow: hidden;

      &.hidden {
        max-height: 0;
      }
    }

    .multitimeline__streamer-name {
      padding-top: 4px;
      padding-left: 5px;
      line-height: 10px;
      height: 18px;
      text-align: right;
      padding-right: 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: 'Roboto', sans-serif;
      font-size: 0.9em;
      z-index: 2;
      background: #0E0E10;

      &.confirmed {
        color: #a732e3;
      }
    }

    .multitimeline__day-block {
      font-size: 0.8em;
      padding: 5px;
    }

    .multitimeline__select-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10;
    }

    .multitimeline__select-overlay-content {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .multitimeline__time-bar {
      position: absolute;
      width: 1px;
      height: 100%;
      pointer-events: none;

      &.current {
        background: #E62E2E;
      }

      &.select {
        background: #BFBF4D;
        
        .select-timecode {
          position: absolute;
          background: #B0B051;
          top: -9px;
          transform: translate(0, -50%);
          color: #111;
          font-size: 0.8em;
          padding: 2px;
        }
        .select-timecode__left {
          left: 0;
        }
        .select-timecode__right {
          right: 0;
        }
      }
    }

    a {
      color: #ddd;
    }
  }
`;

export { MultiTimelines };
