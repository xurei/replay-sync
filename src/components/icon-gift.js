import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';

class IconGift extends React.Component {
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{fill: color, width: size}}>
          <path d="M478.609,99.726H441.34c4.916-7.78,8.16-16.513,9.085-25.749C453.38,44.46,437.835,18,411.37,6.269
            c-24.326-10.783-51.663-6.375-71.348,11.479l-47.06,42.65c-9.165-10.024-22.34-16.324-36.962-16.324
            c-14.648,0-27.844,6.32-37.011,16.375l-47.12-42.706C152.152-0.111,124.826-4.502,100.511,6.275
            C74.053,18.007,58.505,44.476,61.469,73.992c0.927,9.229,4.169,17.958,9.084,25.734H33.391C14.949,99.726,0,114.676,0,133.117
            v50.087c0,9.22,7.475,16.696,16.696,16.696h478.609c9.22,0,16.696-7.475,16.696-16.696v-50.087
            C512,114.676,497.051,99.726,478.609,99.726z M205.913,94.161v5.565H127.37c-20.752,0-37.084-19.346-31.901-40.952
            c2.283-9.515,9.151-17.626,18.034-21.732c12.198-5.638,25.71-3.828,35.955,5.445l56.469,51.182
            C205.924,93.834,205.913,93.996,205.913,94.161z M417.294,69.544c-1.244,17.353-16.919,30.184-34.316,30.184h-76.891v-5.565
            c0-0.197-0.012-0.392-0.014-0.589c12.792-11.596,40.543-36.748,55.594-50.391c8.554-7.753,20.523-11.372,31.587-8.072
            C409.131,39.847,418.455,53.349,417.294,69.544z"/>
          <path d="M33.391,233.291v244.87c0,18.442,14.949,33.391,33.391,33.391h155.826V233.291H33.391z"/>
          <path d="M289.391,233.291v278.261h155.826c18.442,0,33.391-14.949,33.391-33.391v-244.87H289.391z"/>
        </svg>
      </span>
    );
  }
  
  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps);
  }
}

export { IconGift };