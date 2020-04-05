const Express = require('express');
const Http = require('http').Server(Express);
const SocketIo = require('socket.io')(Http);
const PORT = process.env.PORT || 3000;

let StartTime = null;
let isOpenLobby = true;
let checkLobbyInterval = null;
let gameLobby = [];


const closeLobby = function () {
    console.log('starting game...')
    clearInterval(checkLobbyInterval);
    checkLobbyInterval = null;
    isOpenLobby = false;
    SocketIo.emit('START_GAME', gameLobby);
    openLobby();
};

const openLobby = function () {
    gameLobby = [];
    isOpenLobby = true;
};

const startLobbyClose = function () {
    console.log(isOpenLobby, checkLobbyInterval)
    if(isOpenLobby && !checkLobbyInterval){
        checkLobbyInterval = setInterval(() => {
            console.log('checking lobby...');
            if(gameLobby.length > 1){
                closeLobby();
            }
        }, 1000);
    }
};

SocketIo.on('connection', socket => {
    socket.on('onBoard', user => {
        SocketIo.emit('introduce', user);
        var srvSockets = SocketIo.sockets.sockets;
        SocketIo.emit('count', Object.keys(srvSockets).length);

        if(StartTime){
            SocketIo.emit('bufferMusic', StartTime);
        }
    });

    socket.on('onLeave', user => {
        SocketIo.emit('goodBye', user);
        setTimeout(() => {
            var srvSockets = SocketIo.sockets.sockets;
            SocketIo.emit('count', Object.keys(srvSockets).length)
        }, 1000)
    });

    socket.on('message', message => {
        SocketIo.emit('relay', message)
    });

    socket.on('joinGameLobby', user => {
       startLobbyClose();
       gameLobby.push(user);
    });

    socket.on('joinTag', user => {
        SocketIo.emit('joinPlayer', user)
    });

    socket.on('MOVE_USER', data => {
        SocketIo.emit('MOVE_TOKEN', data)
    });

    socket.on('masterPlay', time => {
        StartTime = time;
        console.log('here')
    });
});


Http.listen(PORT, () => {
    console.log('listening at :' + PORT + '...')
});