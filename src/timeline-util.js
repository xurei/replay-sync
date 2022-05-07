import { atMidnigth } from './date-util';
import { addDays } from 'date-fns/esm';

export function buildDaysArray(timeFrames) {
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
    /*out.push({
      type: 'ellipsis',
    });*/
  });
  out[out.length-1].lastOfTimeFrame = false;
  
  //out.pop();
  return out;
}
