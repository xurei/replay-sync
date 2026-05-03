import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import Styled from 'styled-components';
import { Vcenter } from './vcenter.jsx';

function OverlayWrapperUnstyled(props) {
  const handleClose = (e) => {
    if (props.onClose && (e.currentTarget === e.target || e.currentTarget === e.target.parentNode || e.currentTarget === e.target.parentNode.parentNode)) {
      props.onClose();
    }
  };
  
  return (
      <div className={props.className} onClick={handleClose}>
        <Vcenter>
          <div className="overlay__content" style={{maxWidth: props.width}}>
            {props.onClose && (
              <div className="overlay__close-button" onClick={props.onClose}>
                ×
              </div>
            )}
            <div className="overlay__content-scroll">
              {props.children}
            </div>
          </div>
        </Vcenter>
      </div>
  );
}

//language=SCSS
const OverlayWrapper = Styled(OverlayWrapperUnstyled)`
& {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.3);
  
  .overlay__close-button {
    position: absolute;
    right: 12px;
    top: 10px;
    width: 30px;
    height: 30px;
    line-height: 24px;
    font-size: 30px;
    text-align: center;
    color: #bbb;
    z-index: 100;
    border-radius: 100px;
    
    &:hover {
      color: #fff;
      background: rgba(255,255,255, 0.2);
      cursor: pointer;
    }
  }
  
  .overlay__content {
    position: relative;
    margin: auto;
    max-width: 1024px;
    width: 80%;
    box-shadow: 0 0 10px rgba(0,0,0, 0.5);
    border-radius: 16px;
  }

  .overlay__content-scroll {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background: #111;
    border-radius: 16px 16px 14px 14px;
  }
}
`;

OverlayWrapper.propTypes = {
  onClose: PropTypes.func,
  width: PropTypes.string,
};

export { OverlayWrapper };
