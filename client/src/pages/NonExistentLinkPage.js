import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import Header from '../components/Header';
import Footer from '../components/Footer';

/**
 * Non-existent Link page component - minimalistic design
 */
const NonExistentLinkPage = () => {
  const location = useLocation();
  const { shortCode } = location.state || { shortCode: '' };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor="#fafafa">
      <Header />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 3, md: 5 },
        }}
      >
        <Container maxWidth="sm">
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, md: 4 }, 
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid #EDF2F7',
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mb: 2
              }}
            >
              <LinkOffIcon 
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '3rem' }, 
                  color: '#A0AEC0',
                  opacity: 0.8
                }} 
              />
            </Box>
            
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: '500',
                color: 'text.primary',
                lineHeight: 1.2,
                mb: 1,
                letterSpacing: '-0.5px'
              }}
            >
              Link Not Found
            </Typography>
            
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 350, mx: 'auto', mb: 3, fontSize: '0.875rem' }}
            >
              The shortened link you're trying to access doesn't exist or may have been removed.
              {shortCode && (
                <Typography 
                  component="span" 
                  display="block" 
                  sx={{ mt: 1, fontStyle: 'italic', fontSize: '0.75rem' }}
                >
                  Requested link: <code>{shortCode}</code>
                </Typography>
              )}
            </Typography>
            
            <Box mt={1}>
              <Button
                component={RouterLink}
                to="/"
                variant="outlined"
                color="primary"
                size="medium"
                sx={{ px: 3, py: 0.75 }}
              >
                Create New URL
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default NonExistentLinkPage; 