import { RTCService } from './rtc-service';

/*

Messages :
- current timestamp            Envoyé lors d'un changement de temps dans une VOD ? Ou de façon régulière
  + playing status
  + timelines?
- peer name                    Envoyé à la connection et en cas de changement de nom
- j'ai perdu mon pantalon      Bisou DesmuCS

- add marker                   Envoyé à la création d'un marqueur (v2)

*/

export const WatchpartyService = {
  clientConnection: null,
  roomId: null,
  onReceivePlayingStatusCb: null,
  onReceivePeerNameCb: null,
  onPeerConnectCb: null,
  onPeerDisconnectCb: null,
  
  init() {
    RTCService.onData(WatchpartyService.onData);
  },
  
  startWatchParty() {
    return RTCService.init();
  },
  
  connectToWatchParty(roomId) {
    return RTCService.init()
    .then((peerId) => {
      RTCService.addConnectionTo(roomId)
      return peerId;
    });
  },
  
  onData(data) {
    console.log('[WATCHPARTY] data received', data);
    
    if (data.data.type === 'playingStatus') {
      WatchpartyService.onReceivePlayingStatusCb(data.peerId, data.data);
    }
    else if (data.data.type === 'peerName') {
      WatchpartyService.onReceivePeerNameCb(data.peerId, data.data.peerName);
    }
    else {
      console.log('[WATCHPARTY] Unhandled message ', data.data.type);
    }
    
    /*if (!state.watchPartyIsHost) {
      if (data.type === 'currentTime') {
        this.setState(state => ({
          ...state,
          global_time: data.data,
        }));
      }
    }*/
  },
  
  broadcastTime(timestamp) {
    RTCService.broadcast({
      type: 'playingStatus',
      timestamp: timestamp,
      //TODO add playingState,
      //TODO add streamers,
    });
  },
  
  broadcastPeerName(peerName) {
    RTCService.broadcast({
      type: 'peerName',
      peerName: peerName,
      //TODO add playingState,
      //TODO add streamers,
    });
  },
  
  onReceivePlayingStatus(callback) {
    WatchpartyService.onReceivePlayingStatusCb = callback;
  },
  
  onReceivePeerName(callback) {
    WatchpartyService.onReceivePeerNameCb = callback;
  },
  
  onPeerConnect(callback) {
    WatchpartyService.onPeerConnectCb = callback;
  },
  
  onPeerDisconnect(callback) {
    WatchpartyService.onPeerDisconnectCb = callback;
  },
};
