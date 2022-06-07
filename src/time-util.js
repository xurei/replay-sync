export function tsToVodTime(ts) {
  ts = Math.floor(ts/1000);
  const s = ts % 60;
  ts -= s;
  ts /= 60;
  const m = ts % 60;
  ts -= m;
  ts /= 60;
  const h = ts;
  return `${h}h${m}m${s}s`;
}

export function tsToVodTimeShort(ts) {
  ts = Math.floor(ts/1000);
  const s = ts % 60;
  ts -= s;
  ts /= 60;
  const m = ts % 60;
  ts -= m;
  ts /= 60;
  const h = ts;
  if (h > 0) {
    return `${h}h${m}m${s}s`;
  }
  else if (m > 0) {
    return `${m}m${s}s`;
  }
  else {
    return `${s}s`;
  }
}

export function tsToTime(ts) {
  ts = Math.floor(ts/1000);
  const s = ts % 60;
  ts -= s;
  ts /= 60;
  const m = ts % 60;
  ts -= m;
  ts /= 60;
  const h = ts;
  return `${h}:${m<10?'0':''}${m}:${s<10?'0':''}${s}`;
}

const durationRegex = /(?:([0-9]+)h)?(?:([0-9]+)m)?([0-9]+)s/;
export function vodTimeToTs(vodTime) {
  const m = vodTime.match(durationRegex);
  if (m) {
    return (parseInt(m[1] || '0') * 3600 + parseInt(m[2] || '0') * 60 + parseInt(m[3])) * 1000;
  }
  else {
    console.error(`incorrect VOD time ${vodTime}`);
  }
}
