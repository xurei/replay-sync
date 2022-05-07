import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import Styled from 'styled-components';
import { buildDaysArray } from '../timeline-util';
import deepEqual from 'deep-eql';

class DayBlocks extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    showLabel: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string,
  };
  
  render() {
    const props = this.props;
    
    const daysArray = buildDaysArray(props.config.timeFrames);
  
    const totalLength = daysArray.reduce((acc, dayObj) => {
      if (dayObj.type === 'ellipsis') {
        return acc;
      }
      else {
        return acc + dayObj.duration;
      }
    }, 0);
    
    let curLeftRatio = 0;
    return (
      <div className={props.className}>
        {daysArray.map(dayObj => {
          const divW = dayObj.duration / totalLength;
          const out = (
            <div key={dayObj.start} className="day-blocks__day-block" style={{
              left: `${curLeftRatio*100}%`,
              width: `${divW*100}%`,
              borderLeft: dayObj.firstOfTimeFrame ? 'solid 1px #888' : 'none',
              height: props.height || 18,
            }}>
              {props.showLabel && (
                <div className="text-center" style={{paddingTop: '5px', fontSize:'0.8em'}}>
                  {divW*props.width > 60 ? `Jour ${dayObj.index}`: `J${dayObj.index}`}
                </div>
              )}
            </div>
          );
          curLeftRatio += divW;
          return out;
        })}
      </div>
    );
  }
  
  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps);
  }
}

//language=SCSS
DayBlocks = Styled(DayBlocks)`
& {
  .day-blocks__day-block {
    position: absolute;

    &:nth-child(2n) {
      background: #191919;
      //background: red;
    }
  }
}
`;

export { DayBlocks };
