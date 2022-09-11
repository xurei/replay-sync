import addHours from 'date-fns/addHours';
import { format } from 'date-fns-tz';

const dateFormats = {
  time: 'HH:mm',
  fullTime: 'HH:mm:ss',
  date: 'dd/MM/yyyy',
  dateTime: 'dd/MM/yyyy HH:mm',
  dateTimeDay: 'eeee dd/MM/yyyy HH:mm',
  dateTimeSeconds: 'dd/MM/yyyy HH:mm:ss',
};

export function asDate(d) {
  return (typeof(d) === 'string' || !isNaN(d)) ? new Date(d) : d;
}

export function dateDiff(early, late) {
  return asDate(late).getTime() - asDate(early).getTime();
}

export function atMidnigth(/*Date*/d) {
  d = asDate(d);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function atNoon(/*Date*/d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
}

export function floorHour(/*Date*/d) {
  d = asDate(d);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
}

export function ceilHour(/*Date*/d) {
  d = asDate(d);
  const floored = floorHour(d);
  if (d.getTime() !== floored.getTime()) {
    return addHours(floored, 1);
  }
}

export function formatDuration(/*Number*/ ms, options) {
  options = Object.assign({
    years: true,
    months: true,
    days: true,
    hours: true,
    minutes: true,
    seconds: true
  }, options);
  ms = Math.floor(ms / 1000);
  
  const out = [];
  
  if (options.years && ms > 365*24*3600) {
    const y = Math.floor(ms/365/24/3600);
    ms -= y*365*24*3600;
    out.push(`${y} years`);
  }
  
  if (options.months && ms > 31*24*3600) {
    const m = Math.floor(ms/31/24/3600);
    ms -= m*31*24*3600;
    out.push(`${m} months`);
  }
  
  if (options.days && ms > 24*3600) {
    const d = Math.floor(ms/24/3600);
    ms -= d*24*3600;
    out.push(`${d} days`);
  }
  
  if (options.hours && ms > 3600) {
    const h = Math.floor(ms/3600);
    ms -= h*3600;
    out.push(`${h}h`);
  }
  
  if (options.minutes && ms > 60) {
    const m = Math.floor(ms/60);
    ms -= m*60;
    out.push(`${m}min`);
  }
  
  if (options.seconds) {
    out.push(`${ms}s`);
  }
  
  return out.join(' ');
}

export function dateCompare(/*Date*/ a, /*Date*/ b) {
  return asDate(a).getTime() - asDate(b).getTime();
}

function _format(date, dateFormat) {
  try {
    return format(asDate(date), dateFormat, { useAdditionalDayOfYearTokens: true, timeZone: 'Europe/Paris' });
  }
  catch (e) {
    console.error(e);
    return `Invalid Date Format: ${date}`;
  }
}

export function getDayOfYear(date) {
  return parseInt(_format(date, 'D'));
}

export function formatDate(date) {
  return _format(date, dateFormats.date);
}

export function formatTime(date) {
  return _format(date, dateFormats.time);
}

export function formatFullTime(date) {
  return _format(date, dateFormats.fullTime);
}

export function formatDateTime(date) {
  return _format(date, dateFormats.dateTime);
}

export function formatDateTimeDay(date) {
  return _format(date, dateFormats.dateTimeDay);
}

export function formatDateTimeSeconds(date) {
  return _format(date, dateFormats.dateTimeSeconds);
}


