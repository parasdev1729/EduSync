const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

// Load environment variables immediately
dotenv.config();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const marksRoutes = require('./routes/marksRoutes');
const circularRoutes = require('./routes/circularRoutes');
const activityRoutes = require('./routes/activityRoutes');
const requestRoutes = require('./routes/requestRoutes');
const userRoutes = require('./routes/userRoutes');
const socketHandler = require('./socket/socketHandler');

// Connect to Database and Start Server
const startServer = async () => {
  try {
    await connectDB();
    
    const app = express();
    const server = http.createServer(app);

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://edu-sync-prod.vercel.app'
    ];
    if (process.env.CLIENT_URL) {
      allowedOrigins.push(process.env.CLIENT_URL.replace(/\/$/, ''));
    }

    const corsOptions = {
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true);
        }
        const cleanOrigin = origin.replace(/\/$/, '');
        const isAllowed = allowedOrigins.indexOf(cleanOrigin) !== -1 ||
                          cleanOrigin.endsWith('.vercel.app') ||
                          cleanOrigin.startsWith('http://localhost:') ||
                          cleanOrigin.startsWith('http://127.0.0.1:');

        if (isAllowed) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      credentials: true
    };

    const io = new Server(server, {
      cors: corsOptions
    });

    // Make io available to controllers
    app.set('io', io);

    // Initialize Socket Handler
    socketHandler(io);

    // Middleware
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors(corsOptions));

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/student', studentRoutes);
    app.use('/api/attendance', attendanceRoutes);
    app.use('/api/marks', marksRoutes);
    app.use('/api/circulars', circularRoutes);
    app.use('/api/activities', activityRoutes);
    app.use('/api/requests', requestRoutes);
    app.use('/api/users', userRoutes);

    // Basic Route
    app.get('/', (req, res) => {
      res.send('EduSync API is running...');
    });

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
