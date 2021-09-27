import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import Styled from 'styled-components';

import { OverlayWrapper } from './overlay-wrapper';
import { FlexChild, FlexLayout } from 'xureact/lib/module/components/layout/flex-layout';
import { IconTipeee } from './icon-tipeee';
import { IconGithub } from './icon-github';

class OverlayDonate extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  };
  
  render() {
    const props = this.props;
    return (
      <OverlayWrapper width={'700px'} onClose={props.onClose}>
        <div className={props.className}>
          <FlexLayout direction="column" className="fullh">
            <FlexChild>
              <h1 style={{marginBottom: 0}}><img src={props.config.logo.size192} alt={props.config.appName} width={96} height={96}/></h1>
              <div style={{paddingBottom: 10}}>
                <h2 style={{marginBottom: 0}}>Vous aimez notre travail ?</h2>
                Vous pouvez faire une donation ici : <br/>
                <br/>
                <div className="d-inline-block" style={{width: '20%'}}>
                  <a href="https://fr.tipeee.com/xureilab" target="_blank" rel="noreferrer">
                    <IconTipeee color={props.config.colorPalette.common.primary} size={80}/>
                    <br/>
                    <br/>
                    Tipeee
                  </a>
                </div>
                <div className="d-inline-block" style={{width: '30%'}}>
                  <a href="https://github.com/sponsors/xurei?frequency=one-time" target="_blank" rel="noreferrer">
                    <IconGithub color={props.config.colorPalette.common.primary} size={60}/>
                    <br/>
                    Github Sponsors
                  </a>
                </div>
                <br/>
                <br/>
                <h3>♥ Merci pour votre soutiens ♥</h3>
              </div>
              <br/>
            </FlexChild>
          </FlexLayout>
        </div>
      </OverlayWrapper>
    );
  }
}

//language=SCSS
OverlayDonate = Styled(OverlayDonate)`
& {
  text-align: center;

  h2 {
    margin-top: 40px;
    
    &:first-child {
      margin-top: 10px;
    }
  }
}
`;

export { OverlayDonate };
