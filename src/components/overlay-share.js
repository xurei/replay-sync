import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';
import Styled from 'styled-components';
import { OverlayWrapper } from './overlay-wrapper';

class OverlayShare extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    link: PropTypes.string.isRequired,
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
      <OverlayWrapper width={'700px'} onClose={props.onClose}>
        <div className={props.className}>
          <h2>Lien de partage</h2>
          <input readOnly type="text" value={props.link} onClick={this.handleCopyLink}/><br/>
          <div className="copied-message">
            {state.copied ? 'Lien copié !' : ''}
          </div>
        </div>
      </OverlayWrapper>
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
    }, 2000);
  }
  
  shouldComponentUpdate(nextProps, nextState) {
      return !deepEqual(this.props, nextProps) || !deepEqual(this.state, nextState);
  }
}

//language=SCSS
OverlayShare = Styled(OverlayShare)`
& {
  text-align: center;
  padding: 20px 20px;
  
  input[type="text"] {
    width: 100%;
    text-align: center;
  }
  
  .copied-message {
    margin-top: 3px;
    height: 20px;
  }
}
`;

export { OverlayShare };
