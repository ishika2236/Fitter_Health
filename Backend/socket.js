const { Server } = require('socket.io');

const initSocket = (server) => {
    const io = new Server(server, {
        pingTimeout: 60000,
        cors: {
            origin: 'http://localhost:5173',
        },
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('setup', (userData) => {
            socket.join(userData.id);
            socket.emit('connected');
        });

        socket.on('join room', (room) => {
            socket.join(room);
            console.log(`User ${socket.id} joined room: ${room}`);
        });

        socket.on('typing', (room) => socket.in(room).emit('typing'));
        socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

        socket.on('new message', (newMessageReceive) => {
            const chat = newMessageReceive.chatId;

            if (!chat.users) {
                console.log('No users available in this chat');
                return;
            }

            chat.users.forEach((user) => {
                if (user._id === newMessageReceive.sender._id) return;
                socket.in(user._id).emit('message received', newMessageReceive);
            });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

module.exports = initSocket;
