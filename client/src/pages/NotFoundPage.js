import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

/**
 * 404 Not Found page component - minimalistic design
 */
const NotFoundPage = () => {
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
              bgcolor: 'background.paper'
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: '500',
                color: 'primary.main',
                fontSize: { xs: '3rem', md: '4rem' },
                lineHeight: 1,
                letterSpacing: '-1px',
              }}
            >
              404
            </Typography>
            
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: '500', mt: 2, mb: 1 }}
            >
              Page Not Found
            </Typography>
            
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 350, mx: 'auto', mb: 3 }}
            >
              The page you are looking for doesn't exist or has been moved.
            </Typography>
            
            <Button
              component={RouterLink}
              to="/"
              variant="outlined"
              color="primary"
              size="medium"
              sx={{ px: 3, py: 0.75 }}
            >
              Back to Homepage
            </Button>
          </Paper>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default NotFoundPage;