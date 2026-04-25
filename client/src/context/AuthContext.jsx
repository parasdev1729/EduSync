import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Unified responsive state
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? saved === 'true' : false; // Default off
  });

  useEffect(() => {
    localStorage.setItem('sidebarOpen', isSidebarOpen);
  }, [isSidebarOpen]);

  const login = async (enrollmentNo, password) => {
    try {
      const response = await api.post('/auth/login', { enrollmentNo, password });
      const { accessToken, user: userData } = response.data;
      setToken(accessToken);
      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const checkAuth = async () => {
    setLoading(true);
    try {
      const response = await api.post('/auth/refresh');
      const { accessToken } = response.data;
      setToken(accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const userResponse = await api.get('/student/me');
      setUser(userResponse.data);
    } catch (error) {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, token, loading, 
      isSidebarOpen, setIsSidebarOpen,
      login, logout, checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
