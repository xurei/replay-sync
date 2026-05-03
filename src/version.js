import localStorage from 'store/dist/store.legacy';

const version = import.meta.env.APP_VERSION;
//_package = null; //Free useless memory as we only need the version field
let lastVersionVisited = localStorage.get('lastVersionVisited');

function hasNewVersion() {
  return lastVersionVisited !== version;
}

function setLastVersionVisited() {
  localStorage.set('lastVersionVisited', version);
  lastVersionVisited = version;
}

export { version, lastVersionVisited, hasNewVersion, setLastVersionVisited };
