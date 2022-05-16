import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';

class IconSkipForward extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.number,
  };
  
  render() {
    const props = this.props;
    const color = props.color || '#000';
    const size = props.size || 32;
    return (
      <span className={`d-inline-block ${props.className || ''}`}>
        <svg viewBox="0 0 768 512" style={{fill: color, width: size}}>
          <path d="m0 512 384-256L0 0zm768-256L384 0v512z"/>
          <path d="M704 0h64v512h-64z"/>
        </svg>
      </span>
    );
  }
  
  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps);
  }
}

export { IconSkipForward };
