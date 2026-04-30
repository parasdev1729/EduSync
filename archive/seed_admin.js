require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./server/models/User');
const connectDB = require('./server/config/db');

const seedAdminTeacher = async () => {
    try {
        await connectDB();

        // Check if admin exists
        const adminExists = await User.findOne({ userId: 'admin1' });
        if (!adminExists) {
            await User.create({
                userId: 'admin1',
                password: 'admin123',
                name: 'System Admin',
                email: 'admin@edusync.com',
                role: 'admin',
                phone: '1234567890'
            });
            console.log('Admin seeded');
        }

        // Check if teacher exists
        const teacherExists = await User.findOne({ userId: 'teacher1' });
        if (!teacherExists) {
            await User.create({
                userId: 'teacher1',
                password: 'teacher123',
                name: 'Prof. Smith',
                email: 'smith@edusync.com',
                role: 'teacher',
                phone: '0987654321',
                department: 'CSE'
            });
            console.log('Teacher seeded');
        }

        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedAdminTeacher();
