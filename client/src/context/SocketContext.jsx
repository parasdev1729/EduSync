import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let socketInstance = null;

    if (user && token) {
      // Initialize socket connection
      socketInstance = io(SOCKET_URL, {
        auth: {
          token: token
        }
      });

      setSocket(socketInstance);

      socketInstance.on('connect', () => {
        console.log('Connected to socket server');
      });

      socketInstance.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });

      // Global event listeners
      socketInstance.on('new_circular', (data) => {
        alert(`🔔 New Circular: ${data.title}`);
      });

      socketInstance.on('new_request', (data) => {
        if (user.role === 'admin') {
          alert(`📝 New Approval Request received: ${data.type}`);
        }
      });

      socketInstance.on('request_status_update', (data) => {
        alert(`📢 Request Update: Your ${data.type} request is now ${data.status.toUpperCase()}`);
      });

      // Cleanup on unmount or when auth changes
      return () => {
        if (socketInstance) {
          socketInstance.disconnect();
          setSocket(null);
        }
      };
    } else {
      // Ensure socket is null if not authenticated
      setSocket(null);
    }
  }, [user, token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export default SocketContext;
