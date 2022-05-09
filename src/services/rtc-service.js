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
                console.log(`[HOST] My id is ${id}`);

                this.peerHost.on('connection', (connection) => {
                    const peerId = connection.peer;
                    connection.on('data', (data) => {
                        console.log('[HOST] Received', data);
                        RTCService.handleMessage(peerId, data);
                    });

                    console.log(`[HOST] ${connection.peer} connected !`);

                    const peerConnection = this.peerHost.connect(connection.peer);
                    peerConnection.on('open', () => {
                        this.clientConnections.push(peerConnection);
                        console.log(`[HOST] Connection with ${connection.peer} open !`);
                        //RTCService.broadcast();
                    });
                });

                returned = true;
                resolve(id);
            });
            this.peerHost.on('error', function(err) {
                console.log(`[HOST] ERROR`, err);
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
                console.log(`[CLIENT] ERROR`, err);
                if (!returned) {
                    reject(err);
                }
            });
            this.peerClient.on('open', (id) => {
                console.log(`[CLIENT] My id is ${id}`);

                this.peerClient.on('connection', (connection) => {
                    const peerId = connection.peer;
                    console.log('[CLIENT] Connected to host');
                    resolve(connection);
                });

                console.log(`[CLIENT] Trying to connect with ${hostId}`);
                this.connection = this.peerClient.connect(hostId);
                this.connection.on('open', () => {
                    console.log(`[CLIENT] Connection with ${hostId} open !`);
                    /*this.connection.send({
                        type: 'SetPlayerName',
                        data: 'plop',
                    });*/
                    returned = true;
                });
                this.connection.on('error', (err) => {
                    console.log(`[CLIENT] ERROR`, err);
                });
            });
        });
    },

    broadcastTime(timestamp) {
        console.log('broadcastTime');
        this.clientConnections.forEach((connection) => {
            console.log('broadcastTime');
            //const clientState = this.formatForClient(connection.peer, gameState);
            connection.send({
                type: 'currentTime',
                data: timestamp,
            });
        });
    },

    send(type, data) {
        this.connection.send({
            type: type,
            data: data
        });
    },

    handleMessage(peerId, message) {
        console.log('handleMessage', peerId, message);
        //switch (message.type) {
        //    // Sent by the host
        //    case 'GameState': {
        //        console.log('UPDATE GAMESTATE');
        //        gameStore.dispatch({
        //            type: 'setGame',
        //            data: message.data,
        //        });
        //        break;
        //    }
        //
        //    // Sent to the host - never received by a non host
        //    case 'SetPlayerName': {
        //        console.log('SET PLAYER NAME', message);
        //        GameHostService.setPlayerName(peerId, message.data);
        //        this.broadcast();
        //        break;
        //    }
        //    case 'Answer': {
        //        console.log('ANSWER');
        //        GameHostService.answer(peerId, message.data);
        //        this.broadcast();
        //        break;
        //    }
        //    case 'Vote': {
        //        console.log('VOTE');
        //        GameHostService.vote(peerId, message.data);
        //        this.broadcast();
        //        break;
        //    }
        //
        //}
    },
};
