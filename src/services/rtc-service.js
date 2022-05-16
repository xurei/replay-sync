// Handles the state of the game as a host
import Peer from 'peerjs';

export const RTCService = {
    peerHost: null,
    peerClient: null,
    connection: null,
    clientConnections: [],
    
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

    initHost() {
        return new Promise((resolve, reject) => {
            let returned = false;
            this.peerHost = RTCService.newPeer();
            this.peerHost.on('open', (id) => {
                console.debug(`[HOST] My id is ${id}`);

                this.peerHost.on('connection', (connection) => {
                    const peerId = connection.peer;
                    /*connection.on('data', (data) => {
                        console.debug('[HOST] Received', data);
                        RTCService.handleMessage(peerId, data);
                    });*/

                    console.debug(`[HOST] ${connection.peer} connected !`);

                    const peerConnection = this.peerHost.connect(connection.peer);
                    peerConnection.on('open', () => {
                        this.clientConnections.push(peerConnection);
                        console.debug(`[HOST] Connection with ${connection.peer} open !`);
                        //RTCService.broadcast();
                    });
                });

                returned = true;
                resolve(id);
            });
            this.peerHost.on('error', function(err) {
                console.error(`[HOST] ERROR`, err);
                if (!returned) {
                    reject(err);
                }
            });
        });
    },

    initClient(hostId) {
        return new Promise((resolve, reject) => {
            let returned = false;
            this.peerClient = RTCService.newPeer();
            this.peerClient.on('error', (err) => {
                console.debug(`[CLIENT] ERROR`, err);
                if (!returned) {
                    reject(err);
                }
            });
            this.peerClient.on('open', (id) => {
                console.debug(`[CLIENT] My id is ${id}`);

                this.peerClient.on('connection', (connection) => {
                    const peerId = connection.peer;
                    console.debug(`[CLIENT] Connected to host ${peerId}`);
                    console.log(connection);
                    resolve(connection);
                });

                console.debug(`[CLIENT] Trying to connect with ${hostId}`);
                this.connection = this.peerClient.connect(hostId);
                this.connection.on('open', () => {
                    console.debug(`[CLIENT] Connection with ${hostId} open !`);
                    /*this.connection.send({
                        type: 'SetPlayerName',
                        data: 'plop',
                    });*/
                    returned = true;
                });
                this.connection.on('error', (err) => {
                    console.error(`[CLIENT] ERROR`, err);
                });
            });
        });
    },

    broadcastData(data) {
        const payload = {
            type: 'currentTime',
            userId: this.peerClient.id,
            data: data,
        };
        this.connection.send(payload);
        this.clientConnections.forEach((connection) => {
            connection.send(payload);
        });
    },

    send(type, data) {
        this.connection.send({
            type: type,
            data: data
        });
    },
};
