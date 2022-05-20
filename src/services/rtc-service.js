// Handles the state of the game as a host
import Peer from 'peerjs';

export const RTCService = {
    peerToutCourt: null,
    peerHost: null,
    peerClient: null,
    connection: null,
    clientConnections: [],
    peerId: null,
    onDataCallback: null,
    
    newPeer() {
        return new Peer({
            //host: '3bca-78-129-38-128.ngrok.io',
            //key: 'react-cah',
            //path: '/myapp',
            //port: 443,
            //secure: true,
            debug: 1,
        });
    },
    
    init() {
        return new Promise((resolve, reject) => {
            let returned = false;
            this.peerToutCourt = RTCService.newPeer();
            this.peerToutCourt.on('open', (id) => {
                // Connection with the PeerServer established, Peer id is known
                console.debug(`[PEER] My id is ${id}`);

                this.peerId = id;
                returned = true;
                resolve(id);
            });
    
            this.peerToutCourt.on('connection', (connection) => {
                // A new connection with a remote peer has been established
                const peerId = connection.peer;
                console.debug(`[PEER] ${peerId} connected !`);
    
                this.faisUnTrucAvecLaConnection(connection);
                
                // TODO this is probably not reliable - maybe use a query system from the peer connecting ?
                setTimeout(() => {
                    this.sendOtherConnections(connection);
                }, 100);
            });
            
            this.peerToutCourt.on('error', function(err) {
                console.error(`[PEER] ERROR`, err);
                if (!returned) {
                    reject(err);
                }
            });
        });
    },
    
    addConnectionTo(remotePeerId) {
        const connection = this.peerToutCourt.connect(remotePeerId);
        connection.on('open', () => {
            console.debug(`[PEER] Connection with ${connection.peer} established !`);
            this.faisUnTrucAvecLaConnection(connection);
        });
    },
    
    faisUnTrucAvecLaConnection(connection) {
        connection.on('data', (packet) => {
            console.log('[PEER] received data', packet);
            
            if (packet.rtcMessageType === 'otherConnection') {
                const hasConnectionAlready = this.clientConnections.findIndex(otherConnection => otherConnection.peer === packet.peerId) > -1;
                if (!hasConnectionAlready) {
                    console.log('[PEER] Other connection received: ', packet.peerId);
                    this.addConnectionTo(packet.peerId);
                }
            }
            else {
                if (this.onDataCallback) {
                    this.onDataCallback({
                        peerId: connection.peer,
                        data: packet.data,
                    });
                }
                else {
                    console.warn('[PEER] onDataCallback not defined - ignored');
                }
            }
        });
        
        this.clientConnections.push(connection);
        
        /*setTimeout(() => {
            connection.send({message:"bonjour copain"});
        }, 10);*/
    },
    
    sendOtherConnections(connection) {
        this.clientConnections.forEach(otherConnection => {
            if (otherConnection.peer !== connection.peer) {
                console.log('[PEER] send other connection');
                connection.send({
                    rtcMessageType: 'otherConnection',
                    peerId: otherConnection.peer,
                });
            }
        });
    },

    broadcast(data) {
        this.clientConnections.forEach((connection) => {
            connection.send({
                rtcMessageType: 'data',
                data: data,
            });
        });
    },
    
    onData(onDataCallback) {
        this.onDataCallback = onDataCallback;
    },
};
