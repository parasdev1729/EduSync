const jwt = require('jsonwebtoken');
const User = require('../models/User');

const socketHandler = (io) => {
    io.on('connection', async (socket) => {
        console.log('New client connected:', socket.id);

        const token = socket.handshake.auth.token || socket.handshake.query.token;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id);

                if (user) {
                    // Join private room
                    socket.join('user:' + user._id);
                    console.log(`Socket ${socket.id} joined room: user:${user._id}`);

                    // Join role-based rooms
                    if (user.role === 'admin') {
                        socket.join('admins');
                        console.log(`Socket ${socket.id} joined room: admins`);
                    } else if (user.role === 'teacher') {
                        socket.join('teachers');
                        console.log(`Socket ${socket.id} joined room: teachers`);
                    } else if (user.role === 'student') {
                        socket.join('students');
                        console.log(`Socket ${socket.id} joined room: students`);
                        if (user.batch) {
                            socket.join('batch:' + user.batch);
                            console.log(`Socket ${socket.id} joined room: batch:${user.batch}`);
                        }
                    }
                }
            } catch (error) {
                console.error('Socket authentication error:', error.message);
            }
        }

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};

module.exports = socketHandler;
