import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';
import Styled from 'styled-components';
//TODO random name generator
//import { uniqueNamesGenerator, Config, adjectives, animals } from 'unique-names-generator';
import WatchPartyPeerControls from './watch-party-peer-controls';
import { WatchpartyService } from '../services/watchparty-service';
import autobind from 'abind';
import { setSubState } from '../state-util';

class WatchPartyPanel extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    config: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    global_time: PropTypes.number.isRequired,
    ready: PropTypes.bool.isRequired,
    //onCreateRoom: PropTypes.func.isRequired,
    //onJoinRoom: PropTypes.func.isRequired,
    onEnabled: PropTypes.func.isRequired,
  };
  
  state = {
    copied: false,
    watchPartyRoomId: null,
    watchPartyEnabled: false,
    myPeerId: null,
    peers: {},
  };
  
  constructor(props) {
    super(props);
    this.handleCopyLink = this.handleCopyLink.bind(this);
    autobind(this);
  }
  
  componentDidMount() {
    WatchpartyService.init();
    WatchpartyService.onReceivePlayingStatus((peerId, playingStatus) => {
      // TODO change the time iff the peerId is marked as synchronized
      this.setState(setSubState('peers', peerId, peerState => {
        //TODO sanitize playingStatus
        return {
          ...peerState,
          ...playingStatus,
        };
      }), () => {
        console.log(this.state);
      });
    });
    WatchpartyService.onReceivePeerName((peerId, peerName) => {
      this.setState(setSubState('peers', peerId, peerState => {
        //TODO sanitize peerName
        return {
          ...peerState,
          peerName: peerName,
        };
      }), () => {
        console.log(this.state);
      });
    });
  }
  
  render() {
    const props = this.props;
    const state = this.state;
    
    if (!props.visible) {
      return null;
    }
    else {
      if (state.watchPartyEnabled) {
        return this.renderEnabledView();
      }
      else {
        return this.renderDisabledView();
      }
    }
  }
  
  renderDisabledView() {
    const props = this.props;
    const state = this.state;
    return (
      <div className={`${props.className} fullh disabled-view`}>
        <h3 className="text-center">Regarder Ensemble</h3>
        <p>Lorem ispum dolor sit amet</p>
        
        <button onClick={this.handleCreateWatchPartyRoom}>Créer un salon</button>
        <br/>
        <button onClick={this.handleJoinWatchPartyRoom}>Rejoindre un salon</button>
      </div>
    );
  }
  
  renderEnabledView() {
    const props = this.props;
    const state = this.state;
    return (
      <div className={`${props.className} fullh`}>
        <h3 className="text-center">Regarder Ensemble</h3>
        {!props.ready ? (
          <p className="text-center">Chargement...</p>
        ) : (
          <div className="text-center">
            <p>Envoyez ce lien pour partager votre session et regarder les POV en sync avec vos amis.</p>
            <input readOnly type="text" value={state.watchPartyRoomId} onClick={this.handleCopyLink}/><br/>
            <div className="copied-message">
              {state.copied ? 'Lien copié !' : ''}
            </div>
          </div>
        )}
        <ul className="peers-list">
          {Object.keys(state.peers).map(peerId => {
            return (
              <WatchPartyPeerControls
                key={peerId}
                className="peer-controls"
                config={props.config}
                peerId={peerId}
                peerData={state.peers[peerId]}
              />
            );
          })}
        </ul>
      </div>
    );
  }
  
  handleCreateWatchPartyRoom() {
    WatchpartyService.startWatchParty()
    .then((roomId) => {
      console.log('ROOM ID', roomId);
      this.setState(state => {
        const peers = {};
        peers[roomId] = {
          peerName: 'moi-même', // TODO change with actual me name
        };
        return {
          ...state,
          watchPartyRoomId: roomId,
          watchPartyEnabled: true,
          peers: peers
        };
      }, () => {
        this.props.onEnabled(this.state.watchPartyEnabled);
      });
    });
  }
  
  handleCopyLink() {
    const props = this.props;
    const state = this.state;
    navigator.clipboard.writeText(state.watchPartyRoomId);
    this.setState(state => ({
      ...state,
      copied: true,
    }));
    setTimeout(() => {
      this.setState(state => ({
        ...state,
        copied: false,
      }));
    }, 5000);
  }
  
  handleJoinWatchPartyRoom() {
    const roomId = prompt('Quel est l\'id du salon ?');
    if (roomId) {
      WatchpartyService.connectToWatchParty(roomId)
      .then((myPeerId) => {
        this.setState(state => {
          const peers = {};
          peers[myPeerId] = {
            peerName: 'moi-même', // TODO change with actual me name
          };
          return {
            ...state,
            myPeerId: myPeerId,
            watchPartyRoomId: roomId,
            watchPartyEnabled: true,
            peers: peers,
          };
        }, () => {
          this.props.onEnabled(this.state.watchPartyEnabled);
          setTimeout(() => {
            WatchpartyService.broadcastPeerName('Jean-Émeline');
          }, 500);
        });
      });
    }
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return !deepEqual(this.props, nextProps) || !deepEqual(this.state, nextState);
  }
}
//language=SCSS
WatchPartyPanel = Styled(WatchPartyPanel)`
& {
  position: absolute;
  z-index: 9;
  width: 360px;
  background: rgba(0,0,0, 0.6);
  padding: 30px 10px;
  text-align: center;
  
  input[type="text"] {
    width: 100%;
    text-align: center;
    cursor: pointer;
  }
  
  .copied-message {
    margin-top: 3px;
    height: 20px;
  }
  
  &.disabled-view button {
    margin-bottom: 8px;
  }
  
  ul.peers-list {
    padding: 0;
    margin: 0;
    
    > .peer-controls {
      padding: 3px;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
}
`;
export { WatchPartyPanel };
