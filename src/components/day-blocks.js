import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import Styled from 'styled-components';
import { addDays } from 'date-fns/esm';
import { atMidnigth } from '../date-util';

class DayBlocks extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    contents: PropTypes.arrayOf(PropTypes.node),
    height: PropTypes.number,
  };
  
  render() {
    const props = this.props;
    const contents = props.contents || [];
    const startTimestamp = props.config.startTimestamp;
    const endTimestamp = props.config.endTimestamp;
    const totalLength = endTimestamp - startTimestamp;
    
    const elements = [];
    let curTimestamp = startTimestamp;
    let index = 0;
    while (curTimestamp < endTimestamp) {
      const nextTimestamp = atMidnigth(addDays(new Date(curTimestamp), 1)).getTime();
      const content = contents[index] || null;
      const dayLength = nextTimestamp - curTimestamp;
      elements.push(
        <div key={curTimestamp} className="day-blocks__day-block" style={{
          left: `${(curTimestamp-startTimestamp)*100 / totalLength}%`,
          width: `${100*dayLength/totalLength}%`,
          height: props.height || 18,
        }}>
          {content}
        </div>
      );
      curTimestamp = nextTimestamp;
      ++index;
    }
    
    return (
      <div className={props.className}>
        {elements}
      </div>
    );
  }
  
  shouldComponentUpdate(nextProps) {
    return false; // ?
  }
}

//language=SCSS
DayBlocks = Styled(DayBlocks)`
& {
  .day-blocks__day-block {
    position: absolute;
    width: 1px;

    &:nth-child(2n) {
      background: #191919;
      //background: red;
    }
  }
}
`;

export { DayBlocks };
