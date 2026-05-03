import React from 'react'; //eslint-disable-line no-unused-vars

const commonStyle = {
	position: 'absolute', width: '100%', height: '100%', left: 0, top: 0,
};
const parentStyle = Object.assign({}, commonStyle, {
	display: 'flex', alignItems: 'center',
});

const childStyle = { width: '100%' };

const Vcenter = (props) => {
	return (
		<div style={parentStyle}>
			<div style={childStyle}>
				{props.children}
			</div>
		</div>
	);
};

export {Vcenter};

