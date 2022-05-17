import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';
import Styled from 'styled-components';
import WatchPartyPeerControls from './watch-party-peer-controls';

class WatchPartyPanel extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    config: PropTypes.object.isRequired,
    enabled: PropTypes.bool.isRequired,
    link: PropTypes.string.isRequired,
    ready: PropTypes.bool.isRequired,
    roomId: PropTypes.string,
    onCreateRoom: PropTypes.func.isRequired,
    onJoinRoom: PropTypes.func.isRequired,
  };
  
  state = {
    copied: false,
  };
  
  constructor(props) {
    super(props);
    this.handleCopyLink = this.handleCopyLink.bind(this);
  }
  
  render() {
    const props = this.props;
    const state = this.state;
    
    if (props.enabled) {
      return this.renderEnabledView();
    }
    else {
      return this.renderDisabledView();
    }
  }
  
  renderDisabledView() {
    const props = this.props;
    const state = this.state;
    return (
      <div className={`${props.className} fullh disabled-view`}>
        <h3 className="text-center">Regarder Ensemble</h3>
        <p>Lorem ispum dolor sit amet</p>
        
        <button onClick={props.onCreateRoom}>Créer un salon</button>
        <br/>
        <button onClick={props.onJoinRoom}>Rejoindre un salon</button>
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
            <input readOnly type="text" value={props.roomId} onClick={this.handleCopyLink}/><br/>
            <div className="copied-message">
              {state.copied ? 'Lien copié !' : ''}
            </div>
          </div>
        )}
        <ul className="peers-list">
          <WatchPartyPeerControls className="peer-controls" config={props.config}
          
          />
          <WatchPartyPeerControls className="peer-controls" config={props.config}
  
          />
          <WatchPartyPeerControls className="peer-controls" config={props.config}
  
          />
        </ul>
      </div>
    );
  }
  
  handleCopyLink() {
    const props = this.props;
    navigator.clipboard.writeText(props.roomId);
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
