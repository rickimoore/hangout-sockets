const Express = require('express');
const Http = require('http').Server(Express);
const SocketIo = require('socket.io')(Http);
const PORT = process.env.PORT || 3000;


SocketIo.on('connection', socket => {
    socket.on('onBoard', user => {
        SocketIo.emit('introduce', user)
    });

    socket.on('onLeave', user => {
        SocketIo.emit('goodBye', user)
    });

    socket.on('message', message => {
        SocketIo.emit('relay', message)
    });
});


Http.listen(PORT, () => {
    console.log('listening at :3000...')
});