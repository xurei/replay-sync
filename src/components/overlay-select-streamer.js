import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';
import { FlexChild, FlexLayout } from 'xureact/lib/cjs/components/layout/flex-layout';
import Styled from 'styled-components';
import { OverlayWrapper } from './overlay-wrapper';

let _streamerLogins = null;
let metaByStreamer = null;
let streamersObj = null;

class OverlaySelectStreamer extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    streamersObj: PropTypes.object.isRequired,
    metaByStreamer: PropTypes.object.isRequired,
    selectedStreamers: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    onClose: PropTypes.func,
  };
  
  state = {
    searchValue: '',
  };
  
  constructor(props) {
    super(props);
    streamersObj = props.streamersObj;
    metaByStreamer = props.metaByStreamer;
    _streamerLogins = Object.keys(metaByStreamer);
  }
  
  getFilteredStreamers() {
    const props = this.props;
    const state = this.state;
    const streamerLogins = _streamerLogins.filter(streamerLogin =>
      !props.selectedStreamers.some(selectedStreamer => selectedStreamer === streamerLogin)
    );
    return streamerLogins
    .filter(login => {
      const streamerName = streamersObj[login];
      const rpNameLowercase = streamerName.rp_name.toLowerCase();
      const searchValueLowercase = state.searchValue.toLowerCase();
      return (
        login.indexOf(searchValueLowercase) !== -1
        || rpNameLowercase.indexOf(searchValueLowercase) !== -1
      );
    });
  }
  
  render() {
    const props = this.props;
    const state = this.state;
    return (
      <OverlayWrapper onClose={props.onClose}>
        <div className={props.className}>
          <FlexLayout direction="column">
            <FlexChild height={10} grow={0}/>
            <FlexChild height={60} grow={0}>
              <div className="text-center">
                <input autoFocus={true} className="select-streamer__search-input" type="text"
                  placeholder="Nom RP / Nom du streamer"
                  value={state.searchValue}
                  onChange={(e) => {
                    this.setState(state => ({
                      ...state,
                      searchValue: e.target.value,
                    }));
                  }}
                onKeyPress = {e => {
                  if (e.key === 'Enter' || e.key === 'enter') {
                    const chosenStreamer = this.getFilteredStreamers()[0];
                    if (chosenStreamer) {
                      //console.log(chosenStreamer);
                      this.props.onSelect(chosenStreamer);
                    }
                  }
                }}/>
              </div>
            </FlexChild>
            <FlexChild height={1} grow={1}>
              <div className="fullh scroll-y select-streamer__scrollview">
                {this.getFilteredStreamers()
                .filter(login => {
                  const streamerName = streamersObj[login];
                  const rpNameLowercase = streamerName.rp_name.toLowerCase();
                  const searchValueLowercase = state.searchValue.toLowerCase();
                  return (
                       login.indexOf(searchValueLowercase) !== -1
                    || rpNameLowercase.indexOf(searchValueLowercase) !== -1
                  );
                })
                .map(login => (
                  <div key={login} className="select-streamer__streamer" onClick={() => {
                    this.props.onSelect(login);
                    //this.setStreamer(index, login);
                  }}>
                    <div className="select-streamer__avatar">
                      <img src={`https://protopotes-website.vercel.app/api/pic?u=${login}`} alt={login}/>
                    </div>
                    <div className="select-streamer__streamer-name">{login}</div>
                    <div className="select-streamer__rp-name">{streamersObj[login].rp_name}</div>
                    {(streamersObj[login].sub_only !== undefined && streamersObj[login].sub_only === true) &&
                      <div className="select-streamer__sub-only">Sub Only</div>
                    }
                  </div>
                ))}
              </div>
            </FlexChild>
          </FlexLayout>
        </div>
      </OverlayWrapper>
    );
  }
  
  //shouldComponentUpdate(nextProps) {
  //  return !deepEqual(this.props, nextProps);
  //}
}

//language=SCSS
OverlaySelectStreamer = Styled(OverlaySelectStreamer)`
& {
  height: 700px;
  max-height: 100%;

  .text-big {
    font-size: 25px;
  }

  .select-streamer__scrollview {
    margin: 0 auto;
    padding: 0 20px 0 30px;
    &:before {
      content: "";
      display: block;
      height: 30px;
      background: linear-gradient(to bottom, #111111, rgba(0,0,0, 0));
      position: absolute;
      top: 0;
      left: 0;
      right: 20px;
      pointer-events: none;
    }
    &:after {
      content: "";
      display: block;
      height: 30px;
      background: linear-gradient(to top, #111111, rgba(0,0,0, 0));
      position: absolute;
      bottom: 0;
      left: 0;
      right: 20px;
      pointer-events: none;
    }
  }
  
  .select-streamer__streamer {
    display: inline-block;
    width: 150px;
    height: 185px;
    margin: 0 20px 32px 20px;
    padding: 20px 0;
    //background: #222;
    text-align: center;
    cursor: pointer;
    vertical-align: top;
    color: #ccc;
    
    &:hover {
      color: ${props => props.config.colorPalette.common.primary};
      //box-shadow: 0 0 5px 1px #47AF2E;
      .select-streamer__avatar {
        box-shadow: 0 0 5px 3px ${props => props.config.colorPalette.common.primary};
      }
    }
  }

  .select-streamer__avatar {
    width: 100px;
    height: 100px;
    margin: 0 auto 14px auto;
    background: #333;
    border-radius: 100px;
    overflow: hidden;
    
    > img {
      width: 100%;
    }
  }

  .select-streamer__streamer-name {
    color: #aaa;
    font-weight: 700;
    margin-bottom: 3px;
    font-size: 1.2em;
  }
  .select-streamer__rp-name {
    color: ${props => props.config.colorPalette.common.primary};
    font-size: 0.9em;
    font-weight: 700;
  }
  
  .select-streamer__sub-only {
    margin-top: 6px;
    background: ${props => props.config.colorPalette.common.primary};
    border-radius: 5px;
    display: inline-block;
    padding: 3px 5px;
    font-size: 0.8em;
    color: #111111;
  }
}
`;

export { OverlaySelectStreamer };
