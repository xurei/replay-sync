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

let Timeline = React.memo(function Timeline(props) {
  const getMatchingTimeframe = (vod) => {
    for (let timeframe of props.config.timeFrames) {
      const vodStart = vod.createdTs;
      const vodEnd = vod.createdTs+vod.duration_ms;
      // Start time inside timeframe  | ---|--  and | -- |
      if (timeframe.startTimestamp <= vodStart && vodStart <= timeframe.endTimestamp) {
        return timeframe;
      }
      // End time inside timeframe   -|--- |   (and | -- | but arleady matched)
      else if (timeframe.startTimestamp <= vodEnd && vodEnd <= timeframe.endTimestamp) {
        return timeframe;
      }
      // timeframe fully inside vod --|----|--
      else if (vodStart <= timeframe.startTimestamp && timeframe.endTimestamp <= vodEnd) {
        return timeframe;
      }
    }
    return null;
  };
  /// Make sure the VOD is inside the timeframes. If the VOD started before, update the duration and
  /// start_time to match the beginning of the timeframe
  const clampVod = (vod) => {
    const timeframe = getMatchingTimeframe(vod);
    if (!timeframe) {
      // Fallback - should not happen
      return vod;
    }
    
    vod = {...vod};
    vod.startTimestamp = Math.max(vod.createdTs, timeframe.startTimestamp);
    return vod;
  };
  const calculateLeft = (vod, totalLength) => {
    const matchingTimeframe = getMatchingTimeframe(vod);
    if (!matchingTimeframe) {
      console.error(`No matching timeline found for VOD ${vod.id}`);
      // Fallback - should not happen
      return 100.0;
    }
    let out = 0.0;
    for (let timeframe of props.config.timeFrames) {
      if (matchingTimeframe === timeframe) {
        return out + (vod.createdTs - timeframe.startTimestamp) / totalLength;
      }
      else {
        out += (timeframe.endTimestamp - timeframe.startTimestamp) / totalLength;
      }
    }
    return out;
  };
  
  const vods = Object.values(props.vods || {}).filter(getMatchingTimeframe);
    
    const daysArray = buildDaysArray(props.config.timeFrames, props.config.timelineType);
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
            {props.statsMode && vods.map(clampVod).map(vod => {
              const left = calculateLeft(vod, totalLength);
              return (
                <div key={vod.id} className={`timeline__vod-block original`} style={{
                  left: `${left*100}%`,
                  width: `${vod.duration_ms_orig*100 / totalLength}%`,
                }}>
                </div>
              );
            })}
            {vods.map(clampVod).map(vod => {
              const left = calculateLeft(vod, totalLength);
              
              return (
                <div key={vod.id}
                  className={`timeline__vod-block ${vod.permanent_id ? 'persisted' + (vod.permanent_id.confirmed ? ' confirmed':'') + (vod.permanent_id.error ? ' error':'') : ''} ${props.disabled ? ' disabled': ''}`}
                  data-vod={vod.id}
                  style={{
                    left: `${left*100}%`,
                    width: `${vod.duration_ms*100 / totalLength}%`,
                  }}
                />
              );
            })}
            {/*{watchedBlocks.map(watchedBlock => {*/}
            {/*  const left = this.calculateLeft(vod.createdTs, totalLength);*/}
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
}, (prevProps, nextProps) => deepEqual(prevProps, nextProps));

Timeline.propTypes = {
  config: PropTypes.object.isRequired,
  vods: PropTypes.object.isRequired,
  time: PropTypes.number.isRequired,
  onRemoveStreamer: PropTypes.func.isRequired,
  statsMode: PropTypes.bool,
  disabled: PropTypes.bool,
};
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
