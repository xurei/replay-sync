import React from 'react'; //eslint-disable-line no-unused-vars
import { FlexLayout, FlexChild } from 'xureact/lib/module/components/layout/flex-layout';
import Styled from 'styled-components';
import { MultiPlayers } from './components/multi-players';
import { MultiTimelines } from './components/multi-timelines';
import { OverlaySelectStreamer } from './components/overlay-select-streamer';
import { OverlayThanks } from './components/overlay-thanks';
import { version } from './version';
import { OverlayChangelog } from './components/overlay-changelog';
import { metaByStreamer } from './meta';
import { formatDateTimeSeconds, formatFullTime, formatTime, getDayOfYear } from './date-util';
import { zonedTimeToUtc } from 'date-fns-tz';
import { setDayOfYear, setYear } from 'date-fns';
import { TwitchPlayer } from './components/twitch-player';
import deepEqual from 'deep-eql';

const initialTimestamp = new Date('2021-04-21').getTime();
const initialDayOfYear = getDayOfYear(initialTimestamp);

const VOD1 = '996918701';
const VOD2 = '999197520';

class LabView extends React.Component {
  static propTypes = {};
  
  state = {
    video_id: VOD1,
    time: 342000,
    shouldPlay: true,
  };
  
  constructor(props) {
    super(props);
    this.handlePlayerStateChange = this.handlePlayerStateChange.bind(this);
    this.handlePlayerTimeChange = this.handlePlayerTimeChange.bind(this);
  }
  
  render() {
    const props = this.props;
    const state = this.state;
    return (
      <div className={props.className} style={{height: '100vh', width: '100vw'}}>
        <FlexLayout direction="column">
          <FlexChild grow={1} height={1}>
            <TwitchPlayer
              key={state.video_id}
              video_id={state.video_id}
              currentTime={state.time}
              muteOnStart={false}
              shouldPlay={true}
              //onEnded={() => {
              //  //console.log(index, 'ended');
              //  this.videoEnded(index);
              //}}
              onPlayerStateChange={this.handlePlayerStateChange}
              onPlayerTimeChange={this.handlePlayerTimeChange}
            />
          </FlexChild>
          <FlexChild grow={1} width={1}>
            <button onClick={() => {
              console.log('SWITCH');
              this.setState(state => ({
                ...state,
                video_id: state.video_id === VOD1 ? VOD2: VOD1,
              }));
            }}>Switch video</button>
            
          </FlexChild>
        </FlexLayout>
      </div>
    );
  }
  
  handlePlayerStateChange(playerState) {
    console.log(`${new Date().toISOString()} handlePlayerStateChange ${playerState}`);
    this.setState(state => ({
      ...state,
      shouldPlay: (playerState === 'Playing' || playerState === 'Buffering')
    }));
  }
  
  handlePlayerTimeChange(time) {
    console.log(`${new Date().toISOString()} handlePlayerTimeChange ${time}`);
    this.setState(state => ({
      ...state,
      time: time
    }));
  }
}

export { LabView };
