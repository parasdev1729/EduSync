const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const marksRoutes = require('./routes/marksRoutes');
const circularRoutes = require('./routes/circularRoutes');
const activityRoutes = require('./routes/activityRoutes');

// Load environment variables
dotenv.config();

// Connect to Database and Start Server
const startServer = async () => {
  try {
    await connectDB();
    
    const app = express();

    // Middleware
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    }));

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/student', studentRoutes);
    app.use('/api/attendance', attendanceRoutes);
    app.use('/api/marks', marksRoutes);
    app.use('/api/circulars', circularRoutes);
    app.use('/api/activities', activityRoutes);

    // Basic Route
    app.get('/', (req, res) => {
      res.send('EduSync API is running...');
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
