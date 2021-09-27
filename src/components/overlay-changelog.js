import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import Styled from 'styled-components';

import { OverlayWrapper } from './overlay-wrapper';
import changelog from '../CHANGELOG.md';
import ReactMarkdown from 'react-markdown';
import { FlexChild, FlexLayout } from 'xureact/lib/module/components/layout/flex-layout';
import { IconDiscord } from './icon-discord';
import { IconTwitter } from './icon-twitter';
import { IconTwitch } from './icon-twitch';

class OverlayChangelog extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  };
  
  state = {
    changelog: null,
  }
  
  componentDidMount() {
    this._ismounted = true;
    if (this._ismounted) {
      this.setState(state => ({
        ...state,
        loading: false,
        changelog: changelog,
      }));
    }
  }
  
  componentWillUnmount() {
    this._ismounted = false;
  }
  
  render() {
    const props = this.props;
    const state = this.state;
    return (
      <OverlayWrapper width={'700px'} onClose={props.onClose}>
        <div className={props.className}>
          <FlexLayout direction="column" className="fullh">
            <FlexChild>
              <h1 style={{marginBottom: 0}}><img src={props.config.logo.size192} alt="RPZ Synchro" width={192} height={192}/></h1>
              <h2 style={{marginTop: 0}}>
                Par <a href="https://twitch.tv/xurei" target="_blank" rel="noreferrer">xurei</a>
                {' '}
                et <a href="https://twitter.com/diffty" target="_blank" rel="noreferrer">DiFFtY</a>
              </h2>
              <div>
                <a href="https://discord.gg/hFwbdh5TeX" target="_blank" rel="noreferrer">
                  <IconDiscord size={24} color={props.config.colorPalette.common.primary}/>
                </a>
                <span className="d-inline-block" style={{width: 15}}/>
                <a href="https://www.twitter.com/xurei" target="_blank" rel="noreferrer">
                  <IconTwitter size={24} color={props.config.colorPalette.common.primary}/>
                </a>
                <span className="d-inline-block" style={{width: 15}}/>
                <a href="https://www.twitch.tv/xurei" target="_blank" rel="noreferrer">
                  <IconTwitch size={24} color={props.config.colorPalette.common.primary}/>
                </a>
              </div>
              <br/>
            </FlexChild>
            <FlexChild height={1} grow={1}>
              <div className="overlay-changelog__changelog-content">
                {!state.changelog && 'Chargement...'}
                {state.changelog && (
                  <ReactMarkdown linkTarget="_blank">{state.changelog}</ReactMarkdown>
                )}
              </div>
            </FlexChild>
          </FlexLayout>
        </div>
      </OverlayWrapper>
    );
  }
}

//language=SCSS
OverlayChangelog = Styled(OverlayChangelog)`
& {
  text-align: center;
  height: 70vh;
  min-height: 600px;

  .text-big {
    font-size: 25px;
  }
  
  h2 {
    margin-top: 40px;
    
    &:first-child {
      margin-top: 10px;
    }
  }
  
  .overlay-changelog__changelog-content {
    position: relative;
    overflow-y: scroll;
    height: 100%;
    text-align: left;
    padding: 10px 20px;
    background: #0D0D0D;
    li {
      margin-bottom: 5px;
    }
    a {
      color: inherit;
      text-decoration: underline;
    }
  }
}
`;

export { OverlayChangelog };
