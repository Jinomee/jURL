import React from 'react';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

/**
 * Terms of Service page component with minimalistic design
 */
const TermsPage = () => {
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
          pt: { xs: 3, md: 4 },
          pb: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="md">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            aria-label="breadcrumb" 
            sx={{ 
              mb: 4, 
              '& .MuiBreadcrumbs-separator': { 
                mx: 1,
                color: 'text.disabled'
              },
              '& .MuiBreadcrumbs-li': {
                fontSize: '0.875rem',
              }
            }}
          >
            <Link 
              component={RouterLink} 
              to="/"
              underline="hover"
              sx={{ 
                color: 'text.secondary', 
                fontSize: '0.875rem',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Home
            </Link>
            <Typography 
              color="text.primary" 
              sx={{ 
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              Terms of Service
            </Typography>
          </Breadcrumbs>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.04)',
              boxShadow: '0px 1px 3px rgba(15, 23, 42, 0.04)',
              mb: 4,
            }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                mb: 3,
                fontWeight: 600,
                color: 'text.primary',
                letterSpacing: '-0.01em',
              }}
            >
              Terms of Service
            </Typography>

            <Typography 
              variant="body1" 
              paragraph
              sx={{ 
                color: 'text.secondary',
                mb: 2,
                lineHeight: 1.6,
              }}
            >
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>

            <Typography 
              variant="body1" 
              paragraph
              sx={{ 
                color: 'text.secondary',
                mb: 3,
                lineHeight: 1.6,
              }}
            >
              Please read these Terms of Service ("Terms") carefully before using the jURL service.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              1. Acceptance of Terms
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}
            >
              By accessing or using the jURL service, you agree to be bound by these Terms. If you do not agree to all the terms and conditions, you should not use the service.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              2. Description of Service
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}
            >
              jURL provides a URL shortening service that allows users to create shortened links to web content. The service is provided "as is" and may change without notice.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              3. User Conduct
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}
            >
              You agree not to use jURL for any illegal or unauthorized purpose. You must not:
            </Typography>
            
            <Box component="ul" sx={{ mb: 3, pl: 4, color: 'text.secondary' }}>
              <li>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Use the service to create links to content that is illegal, offensive, harmful, or violates the rights of others
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Attempt to gain unauthorized access to any portion of the service
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Use the service for spamming or phishing activities
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Attempt to interfere with the proper functioning of the service
                </Typography>
              </li>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              4. Intellectual Property
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}
            >
              The jURL service, including all content, features, and functionality, is owned by us and is protected by international copyright, trademark, and other intellectual property laws.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              5. Termination
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}
            >
              We reserve the right to terminate or suspend your access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              6. Disclaimer of Warranties
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}
            >
              The service is provided on an "as is" and "as available" basis. We expressly disclaim all warranties of any kind, whether express or implied, including the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              7. Limitation of Liability
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}
            >
              In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              8. Governing Law
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}
            >
              These Terms shall be governed and construed in accordance with the laws of our jurisdiction, without regard to its conflict of law provisions.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              9. Changes to Terms
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}
            >
              We reserve the right to modify or replace these Terms at any time. It is your responsibility to check the Terms periodically for changes.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              10. Contact Us
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}
            >
              If you have any questions about these Terms, please contact us at terms@zmyj.xyz.
            </Typography>
          </Paper>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default TermsPage; 