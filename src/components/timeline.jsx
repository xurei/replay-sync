import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';
import Styled from 'styled-components';
import { DayBlocks } from './day-blocks';
import { buildDaysArray } from '../timeline-util';

//TODO move inside the props
const watchedBlocks = [
  //{ begin: 1619101081000, end: 1619101081000 + 3600*1000 },
  //{ begin: 1619101081000 + 3600*53*1000, end: 1619101081000 + 3600*1000  + 3600*53*1000},
];

class Timeline extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    vods: PropTypes.object.isRequired,
    time: PropTypes.number.isRequired,
    onRemoveStreamer: PropTypes.func.isRequired,
    statsMode: PropTypes.bool,
    disabled: PropTypes.bool,
  };
  
  calculateLeft(timestamp, totalLength) {
    const props = this.props;
    let out = 0;
    for (let timeframe of props.config.timeFrames) {
      if (timeframe.startTimestamp <= timestamp && timestamp <= timeframe.endTimestamp) {
        return out + (timestamp - timeframe.startTimestamp) / totalLength;
      }
      else {
        out += (timeframe.endTimestamp - timeframe.startTimestamp) / totalLength;
      }
    }
  }
  
  render() {
    const props = this.props;
    const vods = Object.values(props.vods || {});
    
    const daysArray = buildDaysArray(props.config.timeFrames);
    const totalLength = daysArray.reduce((acc, dayObj) => {
      if (dayObj.type === 'ellipsis') {
        return acc;
      }
      else {
        return acc + dayObj.duration;
      }
    }, 0);
    
    if (vods.length === 0) {
      return '';
    }
    else {
      return (
        <div className={`prel ${props.className} ${props.statsMode ? 'stats-mode':''}`}>
          <div className="timeline__lines">
            <DayBlocks config={props.config}/>
            <div className="timeline__base-line"/>
            {props.statsMode && vods.map(vod => {
              const left = this.calculateLeft(vod.created_ts, totalLength);
              return (
                <div key={vod.id} className={`timeline__vod-block original`} style={{
                  left: `${left*100}%`,
                  width: `${vod.duration_ms_orig*100 / totalLength}%`,
                }}>
                </div>
              );
            })}
            {vods.map(vod => {
              const left = this.calculateLeft(vod.created_ts, totalLength);
              return (
                <div key={vod.id}
                  className={`timeline__vod-block ${vod.permanent_id ? 'persisted' + (vod.permanent_id.confirmed ? ' confirmed':'') + (vod.permanent_id.error ? ' error':'') : ''} ${props.disabled ? ' disabled': ''}`}
                  style={{
                    left: `${left*100}%`,
                    width: `${vod.duration_ms*100 / totalLength}%`,
                  }}
                />
              );
            })}
            {/*{watchedBlocks.map(watchedBlock => {*/}
            {/*  const left = this.calculateLeft(vod.created_ts, totalLength);*/}
            {/*  return (*/}
            {/*    <div key={watchedBlock.begin} className={`timeline__watched-block`} style={{*/}
            {/*      left: `${left*100}%`,*/}
            {/*      width: `3%`,*/}
            {/*    }}>*/}
            {/*      /!*Math.floor(vod.duration_ms/3600000 * 10) / 10*!/*/}
            {/*    </div>*/}
            {/*  );*/}
            {/*})}*/}
          </div>
        </div>
      );
    }
  }
  
  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps);
  }
}
//language=SCSS
Timeline = Styled(Timeline)`
& {
  height: 18px;
  line-height: 18px;
  width: 100%;
  
  .timeline__lines {
    position: relative;
    z-index: 1;
  }
  
  .timeline__vod-block, .timeline__watched-block {
    position: absolute;
    //background: #336627;
    background: ${props => props.config.colorPalette.timeline.originalVideo};
    width: 100%;
    height: 6px;
    line-height: 24px;
    top: 8px;
    padding: 0;
    font-size: 0.8em;
    
    &.persisted {
      background: ${props => props.config.colorPalette.timeline.persistedVideo};
    }

    &.disabled {
      background: ${props => props.config.colorPalette.timeline.disabledVideo} !important;
    }
  }
  
  &.stats-mode .timeline__vod-block {

    &.persisted.confirmed {
      background: ${props => props.config.colorPalette.timeline.confirmedVideo};
    }

    &.persisted.error {
      background: ${props => props.config.colorPalette.timeline.erroneousVideo};
    }

    &.original {
      background: ${props => props.config.colorPalette.timeline.originalVideo};
    }
  }

  .timeline__watched-block {
    background: ${props => props.config.colorPalette.timeline.watchedBlock};
  }
  
  .timeline__base-line {
    margin-top: 8px;
    width: 100%;
    height: 6px;
    background: #444;
    position: absolute;
    
    &:hover {
      background: #555;
    }
  }
}
`;

export { Timeline };
