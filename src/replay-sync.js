import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import { StatsView } from './stats-view';
import { PlayerView } from './player-view';
import { prepareMetadata } from './metadata-util';
import { migrateConfig } from './config-util';

class ReplaySync extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    streamersObj: PropTypes.object.isRequired,
    metadata: PropTypes.object.isRequired,
    statsMode: PropTypes.bool,
    className: PropTypes.string,
  };
  
  render() {
    const props = this.props;
    const MainView = props.statsMode ? StatsView : PlayerView;
    const config = migrateConfig(props.config);
    const { metaByStreamer, metaByVid } = prepareMetadata(props.metadata);
    
    return (
      <div className={props.className}>
        <MainView
          config={config}
          streamersObj={props.streamersObj}
          metaByStreamer={metaByStreamer}
          metaByVid={metaByVid}
        />
      </div>
    );
  }
}

export { ReplaySync };
