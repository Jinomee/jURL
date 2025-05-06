import axios from 'axios';

// Use relative URL '/api' instead of absolute URL with port
// This will use the same host/port as the main app
const baseURL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
const token = localStorage.getItem('jurl_token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with an error status
      if (error.response.status === 401) {
        // Unauthorized, could automatically redirect to login
        // or handle token expiration
        console.error('Unauthorized request');
      } else if (error.response.status === 404) {
        console.error('Resource not found');
      } else if (error.response.status >= 500) {
        console.error('Server error');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received from server');
    } else {
      // Something else happened
      console.error('Error setting up request:', error.message);
    }
    
    // Pass the error along for the component to handle
    return Promise.reject(error);
  }
);

export default api;