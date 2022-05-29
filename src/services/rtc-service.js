// Handles the state of the game as a host
import Peer from 'peerjs';

export const RTCService = {
    myPeer: null,
    peerHost: null,
    peerClient: null,
    connection: null,
    clientConnections: [],
    peerId: null,
    onDataCallback: null,
    onNewConnectionCallback: null,
    onConnectionClosedCallback: null,
    
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
            this.myPeer = RTCService.newPeer();
            this.myPeer.on('open', (id) => {
                // Connection with the main Peer established, Peer id is known
                console.debug(`[PEER] My id is ${id}`);

                this.peerId = id;
                returned = true;
                resolve(id);
            });
    
            this.myPeer.on('connection', (connection) => {
                // A new connection with a remote peer has been established
                const peerId = connection.peer;
                console.debug(`[PEER] ${peerId} connected !`);
    
                this.bindConnection(connection);
            });
            
            this.myPeer.on('error', function(err) {
                console.error(`[PEER] ERROR`, err);
                if (!returned) {
                    reject(err);
                }
            });
        });
    },
    
    addConnectionTo(remotePeerId) {
        const connection = this.myPeer.connect(remotePeerId);
        connection.on('open', () => {
            console.debug(`[PEER] Connection with ${connection.peer} established !`);
            this.bindConnection(connection);
            setTimeout(() => {
                connection.send({
                    rtcMessageType: 'requestOtherConnections',
                    peerId: this.myPeer.peer,
                });
            }, 500);
        });
    },
    
    bindConnection(connection) {
        connection.on('close', () => {
            console.log(`CLOSED CONNECTION ${connection.peer}`);
            if (this.onConnectionClosedCallback) {
                this.onConnectionClosedCallback(connection.peer);
            }
        });
        
        connection.on('data', (packet) => {
            console.log('[PEER] received data', packet);
            
            if (packet.rtcMessageType === 'otherConnections') {
                const peerIds = packet.peerIds;
                peerIds.forEach(peerId => {
                    const hasConnectionAlready = this.clientConnections.findIndex(otherConnection => otherConnection.peer === peerId) > -1;
                    if (!hasConnectionAlready) {
                        console.log('[PEER] Other connection received: ', peerId);
                        this.addConnectionTo(peerId);
                    }
                });
            }
            else if (packet.rtcMessageType === 'requestOtherConnections') {
                this.sendOtherConnections(connection);
            }
            else {
                if (this.onDataCallback) {
                    //noinspection JSValidateTypes
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
        
        if (this.onNewConnectionCallback) {
            //noinspection JSValidateTypes
            this.onNewConnectionCallback();
        }
        
        /*setTimeout(() => {
            connection.send({message:"bonjour copain"});
        }, 10);*/
    },
    
    sendOtherConnections(connection) {
        const message = {
            rtcMessageType: 'otherConnections',
            peerIds: [],
        };
        this.clientConnections.forEach(otherConnection => {
            if (otherConnection.peer !== connection.peer) {
                console.log(`[PEER] send other connection ${otherConnection.peer}`);
                message.peerIds.push(otherConnection.peer);
            }
        });
        connection.send(message);
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
    
    onNewConnection(callback) {
        this.onNewConnectionCallback = callback;
    },
    
    onConnectionClosed(callback) {
        this.onConnectionClosedCallback = callback;
    },
};
