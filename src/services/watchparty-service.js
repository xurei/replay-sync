import { RTCService } from './rtc-service';

export const WatchpartyService = {
  clientConnection: null,
  roomId: null,
  onReceiveTimeCb: null,
  onPeerConnectCb: null,
  
  startWatchParty() {
    return RTCService.initHost().then(roomId => {
      console.log("RTC HOST ID: ", roomId);
      return this.connectToWatchParty(roomId);
    });
  },
  
  connectToWatchParty(roomId) {
    return (
      RTCService.initClient(roomId)
      .then(connection => {
        this.clientConnection = connection;
        connection.on('data', (data, ...args) => {
          console.log('[CLIENT] Received data: ', data);
          console.log(args);
          /*if (!state.watchPartyIsHost) {
            if (data.type === 'currentTime') {
              this.setState(state => ({
                ...state,
                global_time: data.data,
              }));
            }
          }*/
          //RTCService.handleMessage(peerId, data);
        });
        return connection.peer;
      })
    );
  },
  
  broadcastTime(timestamp) {
    RTCService.broadcastData(timestamp);
  },
  
  onReceiveTime(callback) {
    this.onReceiveTimeCb = callback;
  },
  
  onPeerConnect(callback) {
    this.onPeerConnectCb = callback;
  },
  
  onPeerDisconnect(callback) {
    this.onPeerDisconnectCb = callback;
  },
};
