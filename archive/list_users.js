require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const listUsers = async () => {
    try {
        await connectDB();
        const students = await User.find({ role: 'student' }).limit(3);
        console.log('Students found:', students.map(u => ({ userId: u.userId, role: u.role, name: u.name })));
        process.exit();
    } catch (error) {
        console.error('Failed to list users:', error);
        process.exit(1);
    }
};

listUsers();
