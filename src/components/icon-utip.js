import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';

import Styled from 'styled-components';

class IconUtip extends React.Component {
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 503.91 619.90" style={{fill: color, width: size}}>
          <path d="M409.345 22.06c-31.688 0-78.263 28.661-78.263 78.625 0 45.731-.103 236.997-.103 277.616 0 40.618-45.135 65.097-78.37 65.097-33.235 0-78.605-19.962-78.605-78.605 0-58.644-.123-240.786-.643-273.332-.382-23.943-27.586-69.455-77.41-69.455s-75.958 47.54-76.61 71.916c-2.183 81.697-.728 227.665-.857 291.258-.123 61.335 72.607 214.08 239.838 214.08s229.334-165.082 229.334-218.07c0-52.99.791-245.636.791-280.102 0-56.302-47.415-79.029-79.102-79.029z"/>
          <circle style={{fill:'#000000',fillOpacity:0.15}} cx="96.286" cy="366.814" r="77.595"/>
          <circle style={{fill:'#ffffff',fillOpacity:0.2}} cx="389.743" cy="442.178" r="75.974"/>
          <circle style={{fill:'#ffffff',fillOpacity:0.15}} cx="409.967" cy="99.828" r="78.741"/>
        </svg>
      </span>
    );
  }
  
  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps);
  }
}

//language=SCSS
IconUtip = Styled(IconUtip)`
& {
    > img {
      ${props => {
        const color = props.color || '#000';
        const css_filter = colorize.colorize(color);
        return css_filter.filter;
      }}
    }
}
`;

export { IconUtip };
