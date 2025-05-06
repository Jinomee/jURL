import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

/**
 * Header component with navigation - minimalistic design
 */
const Header = ({ isAdmin = false }) => {
  const { isAuthenticated, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0}
      sx={{
        borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
        backgroundColor: 'background.paper',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1.5 }}>
          {/* Logo/Brand */}
          <Typography
            variant="h5"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              flexGrow: 1,
              letterSpacing: '-0.025em',
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              fontFamily: '"Inter", sans-serif',
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                color: 'primary.dark',
              },
              transition: 'color 0.2s ease',
            }}
          >
            <Logo 
              width={26} 
              height={26} 
              style={{ 
                marginRight: '8px',
                transition: 'transform 0.3s ease',
              }}
              className="logo-icon"
            />
            <span style={{ color: '#1E293B' }}>j</span>URL
          </Typography>

          {/* Navigation Links */}
          <Box>
            {isAdmin ? (
              // Admin navigation
              <>
                {isAuthenticated() && (
                  <Button
                    variant="text"
                    color="primary"
                    onClick={logout}
                    size="small"
                    sx={{ 
                      ml: 2,
                      px: 3,
                      py: 1, 
                      borderRadius: '10px',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      '&:hover': {
                        backgroundColor: 'rgba(79, 70, 229, 0.04)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Logout
                  </Button>
                )}
              </>
            ) : (
              // Public navigation
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  component={RouterLink}
                  to="/admin/login"
                  size="small"
                  sx={{ 
                    ml: 2,
                    px: 3,
                    py: 1, 
                    borderRadius: '10px',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    borderWidth: '1.5px',
                    '&:hover': {
                      borderWidth: '1.5px',
                      backgroundColor: 'rgba(79, 70, 229, 0.04)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isMobile ? 'Admin' : 'Admin Panel'}
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;