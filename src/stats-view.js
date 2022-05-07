import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';
import Styled from 'styled-components';
import { MultiTimelines } from './components/multi-timelines';

import { style } from './App.css.js';

let metaByStreamer = null;

class StatsView extends React.Component {
  static propTypes = {};
  
  constructor(props) {
    super(props);
    metaByStreamer = props.metaByStreamer;
  }
  
  render() {
    const props = this.props;
    console.log(props);
    
    return (
      <div className={props.className}>
        <style>{style}</style>
        <MultiTimelines
          config={props.config}
          streamersObj={props.streamersObj}
          metaByStreamer={props.metaByStreamer}
          time={0}
          streamers={Object.keys(metaByStreamer).map(streamer => ({ name: streamer, visible: true }))}
          statsMode
        />
      </div>
    );
  }
  
  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps);
  }
}

//language=SCSS
StatsView = Styled(StatsView)`
& {
  padding: 20px;
  overflow: scroll;
  height: 100vh;
  
  table {
    width: 100%;
    position: relative;
  }

  thead td {
    //background: #47AF2E;
    background: #1d6d0c;
    color: #fff;
    text-align: center;
    width: 6.6666%;
    padding: 6px 0 4px 0;
  }
}
`;

export { StatsView };
