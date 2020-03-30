const Express = require('express');
const Http = require('http').Server(Express);
const SocketIo = require('socket.io')(Http);
const PORT = process.env.PORT || 3000;


SocketIo.on('connection', socket => {
    let connectedCounter = 0;

    socket.on('onBoard', user => {
        connectedCounter += 1;
        SocketIo.emit('introduce', user);
        SocketIo.emit('count', connectedCounter);
    });

    socket.on('onLeave', user => {
        connectedCounter -= 1;
        if(connectedCounter < 0) {
            connectedCounter = 0;
        }
        SocketIo.emit('goodBye', user);
        SocketIo.emit('count', connectedCounter);
    });

    socket.on('message', message => {
        SocketIo.emit('relay', message)
    });
});


Http.listen(PORT, () => {
    console.log('listening at :' + PORT + '...')
});