import React from 'react'; //eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';
import Styled from 'styled-components';
import { atMidnigth, dateDiff, formatTime } from '../date-util';
import { FlexChild, FlexLayout } from 'xureact/lib/module/components/layout/flex-layout';

class EventsPanel extends React.Component {
  static propTypes = {
    config: PropTypes.array.isRequired,
    events: PropTypes.array.isRequired,
    onSelectEvent: PropTypes.func.isRequired,
  };
  
  state = {
    copied: false,
  };
  
  constructor(props) {
    super(props);
    this.handleSelectEvent = this.handleSelectEvent.bind(this);
  }
  
  render() {
    const props = this.props;
    const state = this.state;
    return (
      <div className={`${props.className} fullh`}>
        <h3 className="text-center">Evènements</h3>
        {props.events.map((eventData, eventIndex) => (
          <div key={eventIndex} data-eventindex={eventIndex} className="fullw event-line clickable" onClick={this.handleSelectEvent}>
            <FlexLayout direction="row" className="event-line-flexlayout">
              <FlexChild className="time" width={70} grow={0} shrink={0}>
                J{this.renderDayNumber(eventData)}
                {' '}
                {formatTime(eventData.timestamp*1000)}
              </FlexChild>
              <FlexChild className="label" width={200} grow={1} shrink={1}>{eventData.label}</FlexChild>
              <FlexChild className="channels text-right" width={130}>
                {eventData.channels.slice(0, Math.min(eventData.channels.length, 5)).map(channel => (
                  <img key={channel.id} src={`https://protopotes-website.vercel.app/api/pic?u=${channel.id}`} alt={channel.name}/>
                ))}
              </FlexChild>
            </FlexLayout>
          </div>
        ))}
      </div>
    );
  }
  
  renderDayNumber(eventData) {
    // FIXME when there is multiple timeframes, this is gonne return incorrect values
    const props = this.props;
    const start = atMidnigth(props.config.timeFrames[0].startTimestamp).getTime();
    return Math.ceil((eventData.timestamp*1000 - start)/(1000*3600*24));
  }
  
  handleSelectEvent(e) {
    const props = this.props;
    const eventIndex = parseInt(e.currentTarget.getAttribute('data-eventindex'));
    props.onSelectEvent(props.events[eventIndex]);
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return !deepEqual(this.props, nextProps) || !deepEqual(this.state, nextState);
  }
}
//language=SCSS
EventsPanel = Styled(EventsPanel)`
& {
  position: absolute;
  z-index: 9;
  width: 500px;
  background: rgba(0,0,0, 0.7);
  padding: 30px 10px;
  overflow-y: scroll;
  
  .event-line  {
    &:nth-child(2n) {
      background: transparent;
    }
    &:nth-child(2n+1) {
      background: rgba(200,200,200, 0.1);
    }
    &:hover {
      background: ${props => props.config.colorPalette.common.primary};
      color: rgba(0,0,0, 0.7);
      img {
        border-color: ${props => props.config.colorPalette.button.border};
      }
    }
    .label {
      font-weight: 700;
    }
    .event-line-flexlayout {
      align-items: center;
    }
    .channels {
      padding-right: 20px;
    }
    img {
      width: 40px;
      height: 40px;
      margin-top: 4px;
      border-radius: 100px;
      border: solid 2px ${props => props.config.colorPalette.common.primary};
      background-color: #1F1F23;
      margin-right: -20px;
    }
  }
}
`;
export { EventsPanel };
