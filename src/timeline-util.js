import { atMidnigth } from './date-util';
import { addDays } from 'date-fns/esm';

export function buildDaysArray(timeFrames, timelineType) {
  switch (timelineType) {
    case 'per-timeframe': {
      return buildDaysArrayPerTimeframe(timeFrames);
    }
    
    default:
    case 'per-day': {
      return buildDaysArrayPerDay(timeFrames);
    }
  }
}

function buildDaysArrayPerTimeframe(timeFrames) {
  return timeFrames.map((timeframe, index) => {
    return {
      type: 'day',
      firstOfTimeFrame: true,
      index: index,
      start: timeframe.startTimestamp,
      duration: timeframe.endTimestamp - timeframe.startTimestamp,
    };
  });
}

function buildDaysArrayPerDay(timeFrames) {
  const out = [];
  let index = 1;
  timeFrames.forEach(timeframe => {
    const startTimestamp = timeframe.startTimestamp;
    const endTimestamp = timeframe.endTimestamp;
    let curTimestamp = startTimestamp;
    let isFirst = true;
    while (curTimestamp < endTimestamp) {
      const nextTimestamp = Math.min(endTimestamp, atMidnigth(addDays(new Date(curTimestamp), 1)).getTime());
      const dayLength = nextTimestamp - curTimestamp;
      out.push({
        type: 'day',
        firstOfTimeFrame: isFirst && index>1,
        index: index,
        start: curTimestamp,
        duration: dayLength,
      });
      curTimestamp = nextTimestamp;
      isFirst = false;
      ++index;
    }
    out[out.length-1].lastOfTimeFrame = true;
  });
  out[out.length-1].lastOfTimeFrame = false;
  
  return out;
}
