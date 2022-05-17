import localStorage from 'store/dist/store.legacy';

const version = __APP_VERSION__;
let lastVersionVisited = localStorage.get('lastVersionVisited');

function hasNewVersion() {
  return lastVersionVisited !== version;
}

function setLastVersionVisited() {
  localStorage.set('lastVersionVisited', version);
  lastVersionVisited = version;
}

console.debug(`REPLAY SYNC VERSION ${version}`);

export { version, lastVersionVisited, hasNewVersion, setLastVersionVisited };
