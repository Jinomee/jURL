import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/logo.css';

// Theme
import theme from './styles/theme';

// Context Providers
import { AuthProvider } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUrlDetailsPage from './pages/AdminUrlDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import ExpiredLinkPage from './pages/ExpiredLinkPage';
import NonExistentLinkPage from './pages/NonExistentLinkPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

// Services
import urlService from './services/urlService';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Redirect component for handling shortened URLs
const RedirectHandler = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const handleRedirect = async () => {
      try {
        // First check if the URL exists/is valid without triggering a redirect
        const response = await fetch(`/api/redirect/${code}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        const contentType = response.headers.get('content-type');
        
        if (response.status === 404) {
          // URL not found or expired
          if (contentType && contentType.includes('application/json')) {
            // Parse JSON response to determine exact error
            const data = await response.json();
            
            if (data.reason === 'expired') {
              navigate('/expired', { state: { shortCode: code } });
            } else {
              navigate('/not-found', { state: { shortCode: code } });
            }
          } else {
            // If response is not JSON, just go to not-found page
            navigate('/not-found', { state: { shortCode: code } });
          }
        } else if (!response.ok) {
          // Other error, redirect to general error page
          navigate('/not-found', { state: { shortCode: code } });
        } else {
          // If URL exists and is valid, make a direct request to the redirect API
          // which properly handles click tracking
          try {
            const data = await response.json();
            
            // Directly redirect to the original URL
            if (data.url) {
              // Add a timestamp to avoid browser caching issues
              const timestamp = new Date().getTime();
              const separator = data.url.includes('?') ? '&' : '?';
              window.location.href = `${data.url}${separator}_=${timestamp}`;
            } else {
              navigate('/not-found', { state: { shortCode: code } });
            }
          } catch (parseError) {
            console.error('Error parsing redirect response:', parseError);
            // Fallback to original method
            const timestamp = new Date().getTime();
            window.location.href = `/${code}?_=${timestamp}`;
          }
        }
      } catch (error) {
        console.error('Error during redirect:', error);
        navigate('/not-found', { state: { shortCode: code } });
      } finally {
        setIsLoading(false);
      }
    };

    handleRedirect();
  }, [code, navigate]);

  return isLoading ? <LoadingSpinner /> : null;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            {/* Legal Pages */}
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            
            {/* Error Pages */}
            <Route path="/expired" element={<ExpiredLinkPage />} />
            <Route path="/not-found" element={<NonExistentLinkPage />} />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin" 
              element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} 
            />
            <Route 
              path="/admin/urls/:id" 
              element={<ProtectedRoute><AdminUrlDetailsPage /></ProtectedRoute>} 
            />
            
            {/* Redirect /admin to /admin/dashboard */}
            <Route 
              path="/admin/dashboard" 
              element={<Navigate to="/admin" replace />} 
            />
            
            {/* URL Shortening Redirect Route */}
            <Route path="/:code" element={<RedirectHandler />} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;