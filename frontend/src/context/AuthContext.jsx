/**
 * Authentication Context Provider
 * Smart Campus Complaint & Maintenance Management System
 * MIT Academy of Engineering (MITAOE)
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('mitaoe_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('mitaoe_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Sync session on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('mitaoe_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.warn('Session verification failed:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      const { token: receivedToken, user: receivedUser } = response.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('mitaoe_token', receivedToken);
      localStorage.setItem('mitaoe_user', JSON.stringify(receivedUser));
      return response.data;
    }
    throw new Error(response.data.message || 'Login failed');
  };

  // Register handler
  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      const { token: receivedToken, user: receivedUser } = response.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('mitaoe_token', receivedToken);
      localStorage.setItem('mitaoe_user', JSON.stringify(receivedUser));
      return response.data;
    }
    throw new Error(response.data.message || 'Registration failed');
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('mitaoe_token');
    localStorage.removeItem('mitaoe_user');
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
