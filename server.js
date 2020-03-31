const Express = require('express');
const Http = require('http').Server(Express);
const SocketIo = require('socket.io')(Http);
const PORT = process.env.PORT || 3000;

SocketIo.on('connection', socket => {
    socket.on('onBoard', user => {
        SocketIo.emit('introduce', user);
        var srvSockets = SocketIo.sockets.sockets;
        SocketIo.emit('count', Object.keys(srvSockets).length);
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
});


Http.listen(PORT, () => {
    console.log('listening at :' + PORT + '...')
});