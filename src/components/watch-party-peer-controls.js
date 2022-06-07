import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';
import autobind from 'abind';
import Styled from 'styled-components';
import { FlexChild, FlexLayout } from 'xureact/lib/module/components/layout/flex-layout';
import { IconSyncPeople } from './icon-sync-people';
import { IconFastForward } from './icon-fast-forward';
import { IconSkipForward } from './icon-skip-forward';
import { GlobalTimeService } from '../services/global-time-service';
import { tsToVodTimeShort } from '../time-util';

class WatchPartyPeerControls extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    config: PropTypes.object.isRequired,
    globalTime: PropTypes.number.isRequired,
    isMe: PropTypes.bool.isRequired,
    isSynchronizing: PropTypes.bool.isRequired,
    peerId: PropTypes.string.isRequired,
    peerData: PropTypes.object.isRequired,
    onToggleSync: PropTypes.func.isRequired,
  };
  
  constructor(props) {
    super(props);
    autobind(this);
  }
  
  formatTimestamp(timestamp) {
    const props = this.props;
    timestamp = parseInt(timestamp);
    if (isNaN(timestamp)) {
      return '';
    }
    else {
      const globalTime = props.globalTime;
      const delta = timestamp-globalTime;
      if (delta < -1000) {
        return `-${tsToVodTimeShort(-delta)}`;
      }
      else if (delta < 1000) {
        return 'SYNC';
      }
      else {
        return `+${tsToVodTimeShort(delta)}`;
      }
    }
  }
  
  render() {
    const props = this.props;
    return (
      <li className={`${props.className} watchparty-peer-controls`}>
        <FlexLayout>
          <FlexChild width={100} grow={1} className="peer-details">
            👤 {props.peerData.peerName || 'guest'}
          </FlexChild>
          <FlexChild width={110} className="peer-time">
            <span className="time-info">{props.isMe ? '-' : this.formatTimestamp(props.peerData.timestamp)}</span>
          </FlexChild>
          <FlexChild width={85}>
            {!props.isMe && (
              <div className="peer-controls">
                <button className={`toggle-button ${props.isSynchronizing ? '' : 'toggle-button__off'}`} onClick={this.handleToggleSync}>
                  <IconSyncPeople size={16} color="#fff"/>
                  <div className="watchparty-peer-controls__button-text">Synchroniser</div>
                </button>
                {/*<button className="">*/}
                {/*  <IconFastForward size={14} color="#fff"/>*/}
                {/*  <div className="watchparty-peer-controls__button-text">Rattraper</div>*/}
                {/*</button>*/}
                {/*<button className="">*/}
                {/*  <IconSkipForward size={14} color="#fff"/>*/}
                {/*  <div className="watchparty-peer-controls__button-text">Aller au même temps</div>*/}
                {/*</button>*/}
              </div>
            )}
          </FlexChild>
        </FlexLayout>
        {/*<span className="time-info">2021-04-28 15:28:12</span>*/}
        
      </li>
    );
  }
  
  handleToggleSync() {
    const props = this.props;
    props.onToggleSync(props.peerId, !props.isSynchronizing);
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
  line-height: 24px;

  //.peer-details span:not(:last-child) {
  //  margin-right: 10px;
  //}

  .peer-details {
    font-weight: 700;
    text-overflow: ellipsis;
    padding-right: 10px;
    white-space: nowrap;
    overflow: hidden;
    font-size: 0.9em;
  }
  
  .peer-time {
    padding-left: 10px;
    text-align: right;
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
      
      &.toggle-button {
        border-width: 2px;
        border-color: ${props => props.config.colorPalette.button.border};
        &.toggle-button__off {
          background: ${props => props.config.colorPalette.button.disabledBackground};
        }
        &.toggle-button__on {
          //border-width: 3px;
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
