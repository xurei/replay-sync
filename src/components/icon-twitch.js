import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';

class IconTwitch extends React.Component {
  static propTypes = {
    color: PropTypes.string,
    size: PropTypes.number,
  };
  
  render() {
    const props = this.props;
    const color = props.color || '#000';
    const size = props.size || 32;
    return (
      <span className={`d-inline-block ${props.className || ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{fill: color, width: size}}>
          <path d="M2.149 0 .537 4.119v16.836h5.731V24h3.224l3.045-3.045h4.657l6.269-6.269V0H2.149zm19.164 13.612-3.582 3.582H12l-3.045 3.045v-3.045H4.119V2.149h17.194v11.463zm-3.582-7.343v6.262h-2.149V6.269h2.149zm-5.731 0v6.262H9.851V6.269H12z" />
        </svg>
      </span>
    );
  }
  
  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps);
  }
}

export { IconTwitch };
