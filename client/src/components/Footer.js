import React from 'react';
import { Box, Container, Typography, Link, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Footer component - minimalistic design
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: 'auto',
        backgroundColor: 'transparent',
        borderTop: '1px solid rgba(0, 0, 0, 0.04)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          py={1}
        >
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
            sx={{
              fontSize: '0.8125rem',
              opacity: 0.8,
              letterSpacing: '0.01em',
            }}
          >
            © {currentYear} <span style={{ fontWeight: 500, color: '#4F46E5' }}>j</span>URL
          </Typography>
          
          <Box
            display="flex"
            gap={3}
            mt={{ xs: 2, sm: 0 }}
            justifyContent="center"
          >
            <Link
              component={RouterLink}
              to="/privacy"
              underline="none"
              variant="body2"
              sx={{
                fontSize: '0.8125rem',
                color: 'text.secondary',
                opacity: 0.7,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'primary.main',
                  opacity: 1,
                },
              }}
            >
              Privacy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              underline="none"
              variant="body2"
              sx={{
                fontSize: '0.8125rem',
                color: 'text.secondary',
                opacity: 0.7,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'primary.main',
                  opacity: 1,
                },
              }}
            >
              Terms
            </Link>
            <Link
              href="https://github.com/Jinomee/jURL"
              underline="none"
              variant="body2"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                fontSize: '0.8125rem',
                color: 'text.secondary',
                opacity: 0.7,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'primary.main',
                  opacity: 1,
                },
              }}
            >
              GitHub
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;