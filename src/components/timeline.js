import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';
import Styled from 'styled-components';
import { DayBlocks } from './day-blocks';

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
  
  get totalLength() {
    const props = this.props;
    return props.config.endTimestamp - props.config.startTimestamp;
  }
  
  render() {
    const props = this.props;
    const vods = Object.values(props.vods || {});
    
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
              return (
                <div key={vod.id} className={`timeline__vod-block original`} style={{
                  left: `${(vod.created_ts-props.config.startTimestamp)*100 / this.totalLength}%`,
                  width: `${vod.duration_ms_orig*100 / this.totalLength}%`,
                }}>
                </div>
              );
            })}
            {vods.map(vod => {
              return (
                <div key={vod.id}
                  className={`timeline__vod-block ${vod.permanent_id ? 'persisted' + (vod.permanent_id.confirmed ? ' confirmed':'') + (vod.permanent_id.error ? ' error':'') : ''} ${props.disabled ? ' disabled': ''}`}
                  style={{
                    left: `${(vod.createdTs-props.config.startTimestamp)*100 / this.totalLength}%`,
                    width: `${vod.duration_ms*100 / this.totalLength}%`,
                  }}
                />
              );
            })}
            {watchedBlocks.map(watchedBlock => {
              return (
                <div key={watchedBlock.begin} className={`timeline__watched-block`} style={{
                  left: `${(watchedBlock.begin-props.config.startTimestamp)*100 / this.totalLength}%`,
                  width: `3%`,
                }}>
                  {/*Math.floor(vod.duration_ms/3600000 * 10) / 10*/}
                </div>
              );
            })}
            {this.renderCurrentTime()}
          </div>
        </div>
      );
    }
  }
  
  renderCurrentTime() {
    const props = this.props;
    return (
      <div className="timeline__time-bar" style={{
        left: `${(props.time-props.config.startTimestamp)*100 / this.totalLength}%`,
      }}/>
    );
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
