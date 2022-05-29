import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import autobind from 'abind';
import Styled from 'styled-components';

class InputCopyText extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    copiedText: PropTypes.string,
    value: PropTypes.string.isRequired,
    copiedTimeoutMs: PropTypes.number,
  };
  
  state = {
    copied: false,
  };
  
  constructor(props) {
    super(props);
    autobind(this);
  }
  
  render() {
    const props = this.props;
    const state = this.state;
    return (
      <div className={props.className}>
        <input readOnly type="text" value={props.value} onClick={this.handleCopyLink}/><br/>
        {state.copied && (
          <div className="copied-message">
            <span>
              {state.copied ? props.copiedText : 'Copié !'}
            </span>
          </div>
        )}
      </div>
    );
  }
  
  handleCopyLink() {
    const props = this.props;
    navigator.clipboard.writeText(props.value);
    this.setState(state => ({
      ...state,
      copied: true,
    }), () => {
      setTimeout(() => {
        this.setState(state => ({
          ...state,
          copied: false,
        }));
      }, props.copiedTimeoutMs || 5000);
    });
  }
}

//language=SCSS
InputCopyText = Styled(InputCopyText)`
& {
  position: relative;
  margin: 0;
  padding: 0;
  
  > input[type="text"] {
    margin: 0;
    cursor: pointer;
    width: 100%;
    text-align: inherit;
  }
  
  .copied-message {
    left: 2px;
    top: 2px;
    bottom: 2px;
    right: 2px;
    border-radius: 3px;
    position: absolute;
    background: rgba(200, 200, 200, 0.9);
    color: #111;
    
    > span {
      position: relative;
      top: 50%;
      display: block;
      transform: translate(0, -50%);
    }
  }
}
`;

export { InputCopyText };
