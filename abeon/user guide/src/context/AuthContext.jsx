import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AUTH_STORAGE_KEY = "himora_auth_user";

const defaultDemoUser = {
  id: "u-101",
  name: "Aarav Sen",
  email: "aarav.sen@example.com",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  city: "New Delhi"
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultDemoUser;
    } catch {
      return defaultDemoUser;
    }
  });

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const signIn = (userData) => {
    const newUser = {
      id: "u-" + Date.now(),
      name: userData.name || "Traveller",
      email: userData.email,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      city: userData.city || "India"
    };
    setUser(newUser);
    setIsSignInModalOpen(false);
    return newUser;
  };

  const signOut = () => {
    setUser(null);
  };

  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signIn,
        signOut,
        isSignInModalOpen,
        openSignInModal,
        closeSignInModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
