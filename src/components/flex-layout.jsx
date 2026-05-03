import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function FlexLayout(props) {
    const style = Object.assign({}, props.style, {
        flexDirection: props.direction || 'row',
        flexWrap: props.wrap || 'nowrap',
    });

    return (
        <StyledWrapper className={props.className} style={style}>
            {props.children}
        </StyledWrapper>
    );
}
FlexLayout.propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
    style: PropTypes.object,
    direction: PropTypes.oneOf(['column', 'column-reverse', 'row', 'row-reverse']),
    wrap: PropTypes.oneOf(['nowrap', 'wrap', 'wrap-reverse']),
};

//language=SCSS
const StyledWrapper = styled.div`
& {
    position: relative;
    display: flex;
    height: 100%;
    width: 100%;
}
`;

function FlexChild(props) {
    const style = Object.assign({
        position: 'relative',
    }, props.style, {
        flexGrow: props.grow || 0,
        flexShrink: props.shrink || 0,
        width: props.width,
        height: props.height,
    });
    
    return (
        <div className={props.className} style={style}>
            {props.children}
        </div>
    );
}
FlexChild.propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
    grow: PropTypes.number,
    shrink: PropTypes.number,
    width:  PropTypes.any,
    height:  PropTypes.any,
    style: PropTypes.object,
};

export { FlexLayout, FlexChild };
