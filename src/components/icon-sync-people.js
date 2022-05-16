import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';

class IconSyncPeople extends React.Component {
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
        <svg viewBox="0 0 482.173 482.173" style={{fill: color, width: size}}>
          <path d="M103.889 296.485c-12.586 0-21.905-.148-34.504-.148 22.765 83.917 99.594 144.588 190.606 144.588 10.107 0 18.183-.766 27.887-2.238-.132-11.334 1.395-20.05 3.657-30.773-13.1.837-18.108.201-31.544.201-72.477 0-134.156-46.466-156.102-111.63ZM259.99 79.32c73.518 0 135.928 50.655 157.01 117.295 16.896 6.117 31.173 17.399 40.128 35.949C451.455 128.734 365.218 46 259.99 46c-36.843 0-85.654 10.154-115.206 27.797 9.648 9.242 16.448 19.225 18.462 34.535 23.824-19.622 57.087-29.013 96.744-29.013ZM82.672 62.93c-24.9 3.397-45.65 21.893-51.958 46.401-9.475 36.73 16.045 73.393 53.984 77.544 33.461 3.659 64.244-20.783 68.394-54.311 1.535-12.514-.524-24.475-6.275-35.814-9.345-18.56-27.057-31.174-47.577-33.853-4.707-.589-11.928-.589-16.568.032z"/>
          <path d="M134.629 184.325c-5.097 3.889-13.234 8.136-19.9 10.392-12.68 4.28-27.188 5-40.226 1.96-9.084-2.092-18.463-6.34-26.077-11.796-1.667-1.209-2.908-1.896-3.202-1.765-1.21.457-6.6 4.412-9.87 7.222-3.136 2.713-6.698 6.503-10.26 10.98-2.254 2.81-6.503 9.606-8.561 13.691-6.862 13.529-12.319 33.135-15.064 54.31C.848 274.253 0 284.644 0 287.585v2.255h182.437l-.197-4.836c-.98-22.416-6.47-47.415-14.345-65.42-6.6-15.097-15.946-26.893-27.742-34.965-1.569-1.078-2.975-1.96-3.138-1.927-.13 0-1.209.75-2.385 1.633zm247.778 27.449c-24.9 3.398-45.65 21.894-51.958 46.402-9.475 36.73 16.045 73.393 53.984 77.544 33.461 3.659 64.244-20.783 68.394-54.311 1.535-12.514-.524-24.475-6.275-35.814-9.345-18.56-27.057-31.174-47.577-33.853-4.707-.589-11.928-.589-16.568.032z"/>
          <path d="M434.364 333.17c-5.097 3.889-13.234 8.136-19.9 10.392-12.68 4.28-27.188 5-40.226 1.96-9.084-2.092-18.463-6.34-26.077-11.796-1.667-1.209-2.908-1.896-3.202-1.765-1.21.457-6.6 4.412-9.87 7.222-3.136 2.713-6.698 6.503-10.26 10.98-2.254 2.81-6.503 9.606-8.561 13.691-6.862 13.529-12.319 33.135-15.064 54.31-.621 4.934-1.47 15.325-1.47 18.266v2.255H482.17l-.197-4.836c-.98-22.416-6.47-47.415-14.345-65.42-6.6-15.097-15.946-26.893-27.742-34.965-1.569-1.078-2.975-1.96-3.138-1.927-.13 0-1.209.75-2.385 1.633z"/>
        </svg>
      </span>
    );
  }
  
  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps);
  }
}

export { IconSyncPeople };
