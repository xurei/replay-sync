import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';

class IconDonate extends React.Component {
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
        {/*<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{fill: color, width: size}}>*/}
        {/*  <path d="m466 181h-82.981c5.292-14.426 7.981-29.483 7.981-45 0-74.991-60.561-136-135-136s-135 61.009-135 136c0 15.514 2.688 30.572 7.982 45h-82.982c-8.284 0-15 6.716-15 15v301c0 8.284 6.716 15 15 15h420c8.284 0 15-6.716 15-15v-301c0-8.284-6.716-15-15-15zm-210-151c77.828 0 128.159 83.02 94.436 151h-50.191c4.761-23.361-13.204-45-36.745-45h-15c-4.136 0-7.5-3.364-7.5-7.5s3.364-7.5 7.5-7.5h37.5c8.284 0 15-6.716 15-15s-6.716-15-15-15h-15v-15c0-8.284-6.716-15-15-15s-15 6.716-15 15v15.755c-17.096 3.484-30 18.635-30 36.745 0 20.678 16.822 37.5 37.5 37.5h15c4.136 0 7.5 3.364 7.5 7.5s-3.364 7.5-7.5 7.5h-101.937c-33.722-67.999 16.62-151 94.437-151zm195 181v30h-390v-30zm-390 271v-211h390v211z"/>*/}
        {/*  <path d="m256 312.295c-32.664-26.544-80-3.981-80 43.57 0 20.993 12.556 43.242 37.319 66.128 17.126 15.828 34.104 26.34 34.818 26.78 4.823 2.968 10.904 2.968 15.727 0 .714-.44 17.691-10.952 34.818-26.78 24.762-22.885 37.318-45.134 37.318-66.127 0-47.674-47.409-70.055-80-43.571zm.035 105.723c-18.434-13.006-50.035-39.902-50.035-62.152 0-24.481 23.594-34.597 37.374-13.113 5.9 9.199 19.361 9.185 25.252 0 13.771-21.47 37.374-11.37 37.374 13.113 0 20.459-28.028 46.833-49.965 62.152z"/>*/}
        {/*</svg>*/}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{fill: color, width: size}}>
          {/*<path d="m256 512c-68.38 0-132.668-26.628-181.02-74.98s-74.98-112.64-74.98-181.02 26.629-132.667 74.98-181.02 112.64-74.98 181.02-74.98 132.668 26.628 181.02 74.98 74.98 112.64 74.98 181.02-26.629 132.667-74.98 181.02-112.64 74.98-181.02 74.98zm0-480c-123.514 0-224 100.486-224 224s100.486 224 224 224 224-100.486 224-224-100.486-224-224-224z"/><path d="m256 240c-22.056 0-40-17.944-40-40s17.944-40 40-40 40 17.944 40 40c0 8.836 7.163 16 16 16s16-7.164 16-16c0-34.201-23.978-62.888-56-70.186v-17.814c0-8.836-7.163-16-16-16s-16 7.164-16 16v17.814c-32.022 7.298-56 35.985-56 70.186 0 39.701 32.299 72 72 72 22.056 0 40 17.944 40 40s-17.944 40-40 40-40-17.944-40-40c0-8.836-7.163-16-16-16s-16 7.164-16 16c0 34.201 23.978 62.888 56 70.186v17.814c0 8.836 7.163 16 16 16s16-7.164 16-16v-17.814c32.022-7.298 56-35.985 56-70.186 0-39.701-32.299-72-72-72z"/>*/}
          <path d="m437.02 74.98c-48.352-48.352-112.64-74.98-181.02-74.98s-132.668 26.628-181.02 74.98-74.98 112.64-74.98 181.02 26.629 132.667 74.98 181.02 112.64 74.98 181.02 74.98 132.668-26.628 181.02-74.98 74.98-112.64 74.98-181.02-26.629-132.667-74.98-181.02zm-181.02 165.02c39.701 0 72 32.299 72 72 0 32.877-22.157 60.659-52.318 69.243-2.167.617-3.682 2.566-3.682 4.819v13.486c0 8.616-6.621 16.029-15.227 16.434-9.189.432-16.773-6.889-16.773-15.982v-13.941c0-2.247-1.506-4.197-3.667-4.812-30.032-8.54-52.132-36.113-52.332-68.8-.053-8.725 6.807-16.19 15.529-16.44 9.051-.26 16.47 7 16.47 15.993 0 23.002 19.517 41.532 42.859 39.9 19.704-1.377 35.665-17.339 37.041-37.043 1.63-23.343-16.899-42.857-39.9-42.857-39.701 0-72-32.299-72-72 0-32.877 22.157-60.659 52.318-69.243 2.167-.617 3.682-2.566 3.682-4.819v-13.486c0-8.616 6.621-16.029 15.227-16.434 9.189-.432 16.773 6.889 16.773 15.982v13.941c0 2.247 1.506 4.197 3.667 4.812 30.032 8.54 52.132 36.113 52.332 68.8.053 8.725-6.807 16.19-15.529 16.44-9.051.26-16.47-7-16.47-15.993 0-23.002-19.517-41.532-42.859-39.9-19.704 1.377-35.665 17.339-37.041 37.043-1.63 23.343 16.899 42.857 39.9 42.857z"/>
        </svg>
      </span>
    );
  }
  
  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps);
  }
}

export { IconDonate };
