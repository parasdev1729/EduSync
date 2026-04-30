require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const setPasswords = async () => {
    try {
        await connectDB();
        
        // Update Admin
        const admin = await User.findOne({ userId: 'admin_root' });
        if (admin) {
            admin.password = 'admin123';
            await admin.save();
            console.log('Admin password set to admin123');
        }

        // Update Teacher
        const teacher = await User.findOne({ userId: 'T1001' });
        if (teacher) {
            teacher.password = 'teacher123';
            await teacher.save();
            console.log('Teacher password set to teacher123');
        }

        // Update Student
        const student = await User.findOne({ userId: '2210991001' });
        if (student) {
            student.password = 'student123';
            await student.save();
            console.log('Student password set to student123');
        }

        process.exit();
    } catch (error) {
        console.error('Failed to set passwords:', error);
        process.exit(1);
    }
};

setPasswords();
