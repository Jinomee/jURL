import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jurl_token'));
  const [loading, setLoading] = useState(true);

  // Check token validity on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Set auth header for subsequent requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Make a request to check if token is still valid
        // We could create a specific endpoint for this, but for now we'll use
        // the URLs endpoint since it requires authentication
        await api.get('/urls');
        
        setCurrentUser({ token });
      } catch (error) {
        console.error('Token verification error:', error);
        // If token is invalid (401), clear local storage and state
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('jurl_token');
          setToken(null);
          setCurrentUser(null);
          delete api.defaults.headers.common['Authorization'];
        }
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Login function
  const login = async (password) => {
    try {
      console.log('Attempting login with password:', password);
      
      const response = await api.post('/admin/login', { password });
      console.log('Login response:', response.data);
      
      const { token } = response.data;
      
      if (!token) {
        console.error('Token not found in response');
        toast.error('Server returned invalid response. Please try again.');
        return false;
      }
      
      // Save token to local storage
      localStorage.setItem('jurl_token', token);
      
      // Set auth header for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
      setToken(token);
      setCurrentUser({ token });
      
      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      
      // Log detailed error information
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        const errorMessage = error.response.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        toast.error('Server not responding. Please try again later.');
      } else {
        // Something happened in setting up the request
        console.error('Error setting up request:', error.message);
        toast.error('Network error. Please check your connection.');
      }
      
      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Clear local storage
    localStorage.removeItem('jurl_token');
    
    // Clear auth header
    delete api.defaults.headers.common['Authorization'];
    
    // Update state
    setToken(null);
    setCurrentUser(null);
    
    toast.info('Logged out successfully');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Context value
  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};