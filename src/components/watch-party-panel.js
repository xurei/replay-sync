import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';
import Styled from 'styled-components';
import localStorage from 'store/dist/store.legacy';
//TODO random name generator
import WatchPartyPeerControls from './watch-party-peer-controls';
import { WatchpartyService } from '../services/watchparty-service';
import autobind from 'abind';
import { setSubState } from '../state-util';
import { InputCopyText } from './input-copy-text';
import { FlexChild, FlexLayout } from 'xureact/lib/module/components/layout/flex-layout';
import { LocalStorageService } from '../services/localstorage-service';

let broadcastUsernameTimer = null;

class WatchPartyPanel extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    config: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    globalTime: PropTypes.number.isRequired,
    ready: PropTypes.bool.isRequired,
    onEnabled: PropTypes.func.isRequired,
    myUsername: PropTypes.string.isRequired,
  };
  
  state = {
    watchPartyRoomId: null,
    watchPartyEnabled: false,
    myPeerId: null,
    peers: {},
  };
  
  constructor(props) {
    super(props);
    autobind(this);
    this.state.myUsername = LocalStorageService.getUsername();
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
            <InputCopyText value={state.watchPartyRoomId || ''} copiedText="ID copié !"/>
          </div>
        )}
        <div style={{height: 50}}>
          <FlexLayout direction="row">
            <FlexChild width={80} style={{lineHeight: '52px'}}>Mon nom :</FlexChild>
            <FlexChild grow={1}>
              <input className="watchparty-panel__my-username" type="text" value={state.myUsername} onChange={this.handleUsernameChange}/>
            </FlexChild>
          </FlexLayout>
        </div>
        <ul className="peers-list">
          {Object.keys(state.peers).map(peerId => {
            const isMe = peerId === state.myPeerId;
            const peerData = !isMe ? state.peers[peerId] : {
              ...state.peers[peerId],
              peerName: state.myUsername,
              timestamp: props.globalTime,
            };
            return (
              <WatchPartyPeerControls
                key={peerId}
                className="peer-controls"
                isMe={isMe}
                config={props.config}
                peerId={peerId}
                peerData={peerData}
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
          peerName: state.myUsername,
        };
        return {
          ...state,
          myPeerId: roomId,
          watchPartyRoomId: roomId,
          watchPartyEnabled: true,
          peers: peers
        };
      }, () => {
        this.props.onEnabled(this.state.watchPartyEnabled);
      });
    });
  }
  
  handleJoinWatchPartyRoom() {
    const roomId = prompt('Quel est l\'id du salon ?');
    if (roomId) {
      WatchpartyService.connectToWatchParty(roomId)
      .then((myPeerId) => {
        this.setState(state => {
          const peers = {};
          peers[myPeerId] = {
            peerName: state.myUsername,
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
        });
      });
    }
  }
  
  handleUsernameChange(e) {
    const value = e.target.value;
    LocalStorageService.setUsername(value);
    this.setState(state => ({
      ...state,
      myUsername: value,
    }), () => {
      if (broadcastUsernameTimer) {
        clearTimeout(broadcastUsernameTimer);
      }
      broadcastUsernameTimer = setTimeout(() => {
        WatchpartyService.broadcastPeerName(value);
        broadcastUsernameTimer = null;
      }, 1000);
    });
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
  width: 400px;
  background: rgba(0,0,0, 0.7);
  padding: 30px 10px;
  text-align: center;

  .watchparty-panel__my-username {
  
  }
  
  &.disabled-view button {
    margin-bottom: 8px;
  }
  
  ul.peers-list {
    padding: 16px 0 0 0;
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
