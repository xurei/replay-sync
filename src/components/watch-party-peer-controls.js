import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';
import autobind from 'abind';
import Styled from 'styled-components';
import { FlexChild, FlexLayout } from 'xureact/lib/module/components/layout/flex-layout';
import { IconSyncPeople } from './icon-sync-people';
import { IconFastForward } from './icon-fast-forward';
import { IconSkipForward } from './icon-skip-forward';

class WatchPartyPeerControls extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    config: PropTypes.object.isRequired,
    peerId: PropTypes.string.isRequired,
    peerData: PropTypes.object.isRequired,
  };
  
  constructor(props) {
    super(props);
    autobind(this);
  }
  
  render() {
    const props = this.props;
    return (
      <li className={`${props.className} watchparty-peer-controls`}>
        <FlexLayout>
          <FlexChild grow={1} className="peer-details">
            <span className="username">👤 {props.peerData.peerName || 'guest'}</span>
            <span className="time-info">{props.peerData.timestamp}</span>
            {/*<span className="time-info">2021-04-28 15:28:12</span>*/}
            {/*<span className="time-info">HortyUnderscore, BagheraJones, Alexclick</span>*/}
          </FlexChild>
          <FlexChild width={110}>
            <div className="peer-controls">
              <button className="" disabled>
                <IconSyncPeople size={16} color="#fff"/>
                <div className="watchparty-peer-controls__button-text">Synchroniser</div>
              </button>
              <button className="">
                <IconFastForward size={14} color="#fff"/>
                <div className="watchparty-peer-controls__button-text">Rattraper</div>
              </button>
              <button className="">
                <IconSkipForward size={14} color="#fff"/>
                <div className="watchparty-peer-controls__button-text">Aller au même temps</div>
              </button>
            </div>
          </FlexChild>
        </FlexLayout>
        {/*<span className="time-info">2021-04-28 15:28:12</span>*/}
        
      </li>
    );
  }
  
  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps);
  }
}

//language=SCSS
WatchPartyPeerControls = Styled(WatchPartyPeerControls)`
  & {
    text-align: left;
    list-style: none;
    padding-left: 0;
    margin-left: 0;

    .peer-details span:not(:last-child) {
      margin-right: 10px;
    }

    .username {
      /*color: red;*/
      font-weight: 700;
    }

    .time-info {
      font-size: 0.85em;
    }

    .peer-controls {
      text-align: right;

      button {
        width: 24px;
        height: 24px;
        vertical-align: top;
        line-height: 14px;
        text-align: center;
        margin-left: 3px;
        padding: 2px 0 0;
        position: relative;
        
        &:hover .watchparty-peer-controls__button-text {
          display: block;
          &:hover {
            display: none;
          }
        }
      }
      
      .watchparty-peer-controls__button-text {
        display: none;
        position: absolute;
        background: #0E0E10;
        color: #ccc;
        border: solid 1px ${props => props.config.colorPalette.button.background};
        border-radius: 3px;
        padding: 4px 8px;
        z-index: 10;
        white-space: nowrap;
        top: -32px;
        left: 50%;
        transform: translate(-50%, 1px);
        opacity: 0.9;
        font-size: 1.2em;
        &:before {
          content : "";
          width: 14px;
          height: 7px;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translate(-50%, 0);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14px' viewBox='0 0 128 64'%3E%3Cpath style='fill:${props => encodeURIComponent(props.config.colorPalette.button.background)}' d='M128 0 96 32 64 64l-32-32L0 0h64z'/%3E%3C/svg%3E");
        }
      }
    }
  }
`;

export default WatchPartyPeerControls;
