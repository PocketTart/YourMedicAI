// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      try {
        // Ensure user data is parsed if it exists
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setToken(data.token);
      setIsLoggedIn(true);
      setUser(data.user || null); // Ensure user is set
      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      logout();
      throw error;
    }
  };

  const signup = async (username, email, password) => {
    try {
      const data = await authService.signup(username, email, password);
      setToken(data.token);
      setIsLoggedIn(true);
      setUser(data.user || null); // Ensure user is set
      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      logout();
      throw error;
    }
  };

  // --- NEW FUNCTION: To update user data from other components ---
  const updateUser = (newUserData) => {
    setUser(prevUser => {
      // Merge existing user data with the new incoming data
      // This is crucial because `newUserData` from profile update might only contain profile fields,
      // while `prevUser` might have auth-related fields (username, email).
      const updatedUser = { ...prevUser, ...newUserData };
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Update localStorage
      return updatedUser;
    });
  };
  // --- END NEW FUNCTION ---

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    isLoggedIn,
    loading,
    login,
    signup,
    logout,
    updateUser, 
  };

  return (
    <AuthContext.Provider value={value}>
      {/* show a loading spinner while checking for token */}
      {loading ? <div>Loading authentication...</div> : children}
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