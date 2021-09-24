import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import Styled from 'styled-components';

class DayBlocks extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    contents: PropTypes.arrayOf(PropTypes.node),
    height: PropTypes.number,
  };
  
  midnights = [];
  
  constructor(props) {
    super(props);
    for (let time = props.config.startTimestamp; time <= props.config.endTimestamp; time += 1000*3600*24) {
      this.midnights.push(time);
    }
    console.log(this.midnights);
  }
  
  render() {
    const props = this.props;
    const contents = props.contents || [];
    const startTimestamp = props.config.startTimestamp;
    const endTimestamp = props.config.endTimestamp;
    const totalLength = endTimestamp - startTimestamp;
    return (
      <div className={props.className}>
        {this.midnights.map((midnight, index) => {
          const content = contents[index] || null;
          return (
            <div key={midnight} className="day-blocks__day-block" style={{
              left: `${(midnight-startTimestamp)*100 / totalLength}%`,
              width: `${100/this.midnights.length}%`,
              height: props.height || 18,
            }}>
              {content}
            </div>
          );
        })}
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
