import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';
import Styled from 'styled-components';

class WatchPartyPanel extends React.Component {
  static propTypes = {
    link: PropTypes.string.isRequired,
    ready: PropTypes.bool.isRequired,
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
    return (
      <div className={`${props.className} fullh`}>
        <h3 className="text-center">Regarder Ensemble</h3>
        {!props.ready ? (
          <p className="text-center">Chargement...</p>
        ) : (
          <div className="text-center">
            <p>Envoyez ce lien pour partager votre session et regarder les POV en sync avec vos amis.</p>
            <input readOnly type="text" value={props.link} onClick={this.handleCopyLink}/><br/>
            <div className="copied-message">
              {state.copied ? 'Lien copié !' : ''}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  handleCopyLink() {
    const props = this.props;
    navigator.clipboard.writeText(props.link);
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
  z-index: 50;
  width: 360px;
  background: rgba(0,0,0, 0.6);
  padding: 30px 10px;

  input[type="text"] {
    width: 100%;
    text-align: center;
    cursor: pointer;
  }
  
  .copied-message {
    margin-top: 3px;
    height: 20px;
  }
}
`;
export { WatchPartyPanel };
