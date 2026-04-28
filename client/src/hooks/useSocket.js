import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const { user, token } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (user && token) {
      // Initialize socket connection
      socketRef.current = io(SOCKET_URL, {
        auth: {
          token: token
        }
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to socket server');
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });

      // Event listeners
      socketRef.current.on('new_circular', (data) => {
        // Show notification for new circular
        alert(`🔔 New Circular: ${data.title}`);
      });

      socketRef.current.on('new_request', (data) => {
        // Show notification for admin when a new request is submitted
        if (user.role === 'admin') {
          alert(`📝 New Approval Request: ${data.studentName} - ${data.type}`);
        }
      });

      socketRef.current.on('request_update', (data) => {
        // Show notification for student when their request is updated
        alert(`📢 Request Update: Your ${data.type} request is now ${data.status.toUpperCase()}`);
      });

      // Cleanup on unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [user, token]);

  return socketRef.current;
};

export default useSocket;
