import React from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  Paper,
  useMediaQuery,
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UrlForm from '../components/UrlForm';

/**
 * Home page component with minimalistic design
 */
const HomePage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      minHeight="100vh" 
      sx={{ 
        background: 'linear-gradient(180deg, rgba(249, 250, 251, 0.8) 0%, rgba(248, 250, 252, 1) 100%)',
      }}
    >
      <Header />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          pt: { xs: 4, md: 8 },
          pb: { xs: 6, md: 10 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="md">
          <Box 
            textAlign="center" 
            mb={{ xs: 4, md: 6 }}
          >
            <Typography 
              variant="h2" 
              component="h1" 
              fontWeight="700"
              sx={{ 
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                letterSpacing: '-0.025em',
                background: 'linear-gradient(90deg, #4F46E5 0%, #818CF8 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
              }}
            >
              <span style={{ color: '#1E293B' }}>j</span>URL
            </Typography>
            
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ 
                maxWidth: 500,
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.125rem' },
                fontWeight: 400,
                opacity: 0.9,
                letterSpacing: '0.01em',
                lineHeight: 1.6,
              }}
            >
              Simple, fast URL shortening.
            </Typography>
          </Box>
          
          {/* URL Shortening Form */}
          <Box 
            maxWidth="600px" 
            mx="auto"
            sx={{
              position: 'relative',
              zIndex: 2,
            }}
          >
            <UrlForm />
          </Box>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default HomePage;