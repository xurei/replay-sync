import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';
import Styled from 'styled-components';
import { OverlayWrapper } from './overlay-wrapper';
import { InputCopyText } from './input-copy-text';

class OverlayShare extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    link: PropTypes.string.isRequired,
  };
  
  render() {
    const props = this.props;
    return (
      <OverlayWrapper width={'700px'} onClose={props.onClose}>
        <div className={props.className}>
          <h2>Lien de partage</h2>
          <InputCopyText className="share-input" value={props.link} copiedText="Lien copié !"/>
        </div>
      </OverlayWrapper>
    );
  }
  
  shouldComponentUpdate(nextProps) {
      return !deepEqual(this.props, nextProps);
  }
}

//language=SCSS
OverlayShare = Styled(OverlayShare)`
& {
  text-align: center;
  padding: 20px 20px;
  
  .share-input {
    width: 100%;
    text-align: center;
  }
}
`;

export { OverlayShare };
