import localStorage from 'store/dist/store.legacy';

const version = require('../package.json').version;
let lastVersionVisited = localStorage.get('lastVersionVisited');

function hasNewVersion() {
  return lastVersionVisited !== version;
}

function setLastVersionVisited() {
  localStorage.set('lastVersionVisited', version);
  lastVersionVisited = version;
}

export { version, lastVersionVisited, hasNewVersion, setLastVersionVisited };
