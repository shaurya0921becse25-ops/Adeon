import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: 'usr-442',
  name: 'Aarav Mehta',
  email: 'aarav.mehta@wanderwise.demo',
  avatar: '/images/guide-portrait.jpg',
  handle: '@aarav_travels'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('wanderwise_user');
      return savedUser !== null ? JSON.parse(savedUser) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [userRole, setUserRole] = useState(() => {
    try {
      return localStorage.getItem('wanderwise_role') || 'traveler';
    } catch {
      return 'traveler';
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('wanderwise_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('wanderwise_user');
      }
    } catch (e) {
      console.warn('LocalStorage error saving user:', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('wanderwise_role', userRole);
    } catch (e) {
      console.warn('LocalStorage error saving role:', e);
    }
  }, [userRole]);

  const login = (customUser = null) => {
    setUser(customUser || DEFAULT_USER);
  };

  const logout = () => {
    setUser(null);
  };

  const setRole = (role) => {
    if (role === 'traveler' || role === 'guide') {
      setUserRole(role);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userRole, login, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
