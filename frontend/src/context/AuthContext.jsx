/**
 * ===========================================
 *     AUTH CONTEXT - Global Auth State
 * ===========================================
 * 
 * Manages authentication state across the application.
 * Provides login, logout, register functions and user data.
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// ============================================
// API CONFIGURATION
// ============================================

// Base URL for API requests
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============================================
// CONTEXT CREATION
// ============================================

const AuthContext = createContext(null);

// ============================================
// AUTH PROVIDER COMPONENT
// ============================================

/**
 * AuthProvider Component
 * 
 * Wraps the app and provides auth state to all children.
 * Handles token storage, user loading, and auth operations.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function AuthProvider({ children }) {
  // ----------------------------------------
  // STATE
  // ----------------------------------------
  const [user, setUser] = useState(null);           // Current user data
  const [loading, setLoading] = useState(true);      // Initial auth check loading
  const [error, setError] = useState(null);          // Auth error messages

  // ----------------------------------------
  // EFFECTS
  // ----------------------------------------

  /**
   * Load User on Mount
   * 
   * Checks for existing token and loads user data
   * Runs once when the app initially loads
   */
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Set token in axios header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Fetch current user
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      } catch (err) {
        // Token is invalid or expired
        console.error('Failed to load user:', err);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ----------------------------------------
  // AUTH FUNCTIONS
  // ----------------------------------------

  /**
   * Register User
   * 
   * Creates new account with email and password.
   * 
   * @param {Object} userData - { name, email, password, phone }
   * @returns {Promise<Object>} - User data on success
   * @throws {Error} - On registration failure
   */
  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', userData);

      const { token, user } = response.data;

      // Save token and set user
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);

      return user;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  };

  /**
   * Login User
   * 
   * Authenticates with email and password.
   * 
   * @param {String} email - User's email
   * @param {String} password - User's password
   * @returns {Promise<Object>} - User data on success
   * @throws {Error} - On login failure
   */
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { email, password });

      const { token, user } = response.data;

      // Save token and set user
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);

      return user;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  /**
   * Google Login
   * 
   * Authenticates using Google OAuth credential.
   * Called after Google Sign-In button returns a credential.
   * 
   * @param {String} credential - Google ID token
   * @returns {Promise<Object>} - User data on success
   * @throws {Error} - On Google auth failure
   */
  const googleLogin = async (credential) => {
    try {
      setError(null);
      const response = await api.post('/auth/google', { credential });

      const { token, user } = response.data;

      // Save token and set user
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);

      return user;
    } catch (err) {
      const message = err.response?.data?.message || 'Google login failed';
      setError(message);
      throw new Error(message);
    }
  };

  /**
   * Logout User
   * 
   * Clears token and user state.
   */
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
  };

  /**
   * Clear Error
   * 
   * Clears any existing auth error message.
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Update Profile
   * 
   * Updates user profile information.
   * 
   * @param {Object} profileData - { name, phone, dateOfBirth, gender, address }
   * @returns {Promise<Object>} - Updated user data on success
   * @throws {Error} - On update failure
   */
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await api.put('/auth/profile', profileData);
      setUser(response.data.user);
      return response.data.user;
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed';
      setError(message);
      throw new Error(message);
    }
  };

  // ----------------------------------------
  // CONTEXT VALUE
  // ----------------------------------------

  const value = {
    user,           // Current user object (null if not logged in)
    loading,        // True during initial auth check
    error,          // Error message if auth failed
    isAuthenticated: !!user,  // Boolean for quick auth check
    register,       // Function to register new user
    login,          // Function to login with email/password
    googleLogin,    // Function to login with Google
    logout,         // Function to logout
    clearError,     // Function to clear error state
    updateProfile   // Function to update user profile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// CUSTOM HOOK
// ============================================

/**
 * useAuth Hook
 * 
 * Custom hook to access auth context.
 * Must be used within an AuthProvider.
 * 
 * @returns {Object} - Auth context value
 * @throws {Error} - If used outside AuthProvider
 * 
 * @example
 * const { user, login, logout, isAuthenticated } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Export axios instance for use in other parts of the app
export { api };
