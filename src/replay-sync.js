import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import { StatsView } from './stats-view';
import { PlayerView } from './player-view';
import { prepareMetadata } from './metadata-util';
import { migrateConfig } from './config-util';

class ReplaySync extends React.Component {
  static propTypes = {
    statsMode: PropTypes.bool,
    className: PropTypes.string,
  };
  
  state = {
    ready: false,
    configData: null,
  }
  
  componentDidMount() {
    const location = document.location;
    const path = location.pathname.split('/');
    path.shift();
    console.log(path);
    if (path.length === 0) {
      //TODO Landing page
    }
    else {
      const roomId = path[0];
      fetch(`https://rpz-synchro-git-api-config-xurei.vercel.app/api/config?id=${roomId}`)
      .then(result => result.json())
      .then(data => {
        data.streamersObj = {};
        data.config.streamers.forEach(streamer => {
          data.streamersObj[streamer.user_login] = streamer;
        });
        delete data.streamers;
  
        data.config = migrateConfig(data.config);
        
        //TODO remove logo injection and find a way to put it differently
        data.config.logo = {
          size64: `${process.env.PUBLIC_URL}/logo64.png`,
          size192: `${process.env.PUBLIC_URL}/logo192.png`,
        };
        
        console.log(data.config);
        //Convert timeframe dates to timestamps
        data.config.timeFrames.forEach(timeframe => {
          if (timeframe.startTimestamp) {
            timeframe.startTimestamp = new Date(timeframe.startTimestamp).getTime();
          }
          if (timeframe.endTimestamp) {
            timeframe.endTimestamp = new Date(timeframe.endTimestamp).getTime();
          }
        });
        
        setTimeout(() => {
          this.setState(state => ({
            ...state,
            ready: true,
            configData: data,
          }));
        }, 100);
      })
      .catch(error => {
        //TODO handle error
        console.error(error);
      });
    }
  }
  
  render() {
    const props = this.props;
    const state = this.state;
    
    if (state.ready) {
      const MainView = props.statsMode ? StatsView : PlayerView;
      const { metaByStreamer, metaByVid } = prepareMetadata(state.configData.metadata);
      
      return (
        <div className={props.className}>
          <MainView
            config={state.configData.config}
            streamersObj={state.configData.streamersObj}
            metaByStreamer={metaByStreamer}
            metaByVid={metaByVid}
          />
        </div>
      );
    }
    else {
      // TODO improve loading screen
      return (
        <div className={props.className}>
          LOADING
        </div>
      );
    }
  }
}

export { ReplaySync };
