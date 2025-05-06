import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

/**
 * Admin login page component - minimalistic design
 */
const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!password) {
      setError('Please enter the admin password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const success = await login(password);
      if (success) {
        navigate('/admin');
      } else {
        setError('Invalid password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor="#fafafa">
      <Header />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          py: { xs: 3, md: 5 },
        }}
      >
        <Container maxWidth="sm">
          <Card elevation={0} sx={{ border: '1px solid #EDF2F7', borderRadius: 2 }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box textAlign="center" mb={3}>
                <Typography variant="h5" component="h1" fontWeight="500" gutterBottom>
                  Admin Login
                </Typography>
                <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
                  Enter your password to access the admin panel
                </Typography>
              </Box>
              
              <Box component="form" onSubmit={handleSubmit}>
                {error && (
                  <Typography
                    color="error"
                    variant="body2"
                    sx={{ mb: 2, textAlign: 'center', fontSize: '0.75rem' }}
                  >
                    {error}
                  </Typography>
                )}
                
                <TextField
                  placeholder="Password"
                  variant="outlined"
                  fullWidth
                  size="small"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ fontSize: 18 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  disabled={loading}
                  sx={{ mb: 1 }}
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="medium"
                  fullWidth
                  sx={{ mt: 2, py: 1 }}
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                
                <Box mt={2} textAlign="center">
                  <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                    Default password: admin123
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default AdminLoginPage;