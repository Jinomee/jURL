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
 * Privacy Policy page component with minimalistic design
 */
const PrivacyPage = () => {
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
              Privacy Policy
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
              Privacy Policy
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

            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              1. Information We Collect
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}
            >
              When you use jURL, we collect information that you provide directly to us, such as when you create a shortened URL. This includes:
            </Typography>
            
            <Box component="ul" sx={{ mb: 3, pl: 4, color: 'text.secondary' }}>
              <li>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  The original URL you wish to shorten
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Any custom URL suffix you choose to create
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  URL expiration preferences
                </Typography>
              </li>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              2. How We Use Your Information
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}
            >
              We use the information we collect to provide, maintain, and improve our services, including:
            </Typography>
            
            <Box component="ul" sx={{ mb: 3, pl: 4, color: 'text.secondary' }}>
              <li>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Creating and managing shortened URLs
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Tracking basic analytics such as the number of clicks on your shortened URLs
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Enforcing our terms of service and preventing abuse of our platform
                </Typography>
              </li>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              3. Information Sharing
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}
            >
              We do not sell, trade, or otherwise transfer your information to third parties without your consent, except as described in this policy. We may share information in the following circumstances:
            </Typography>
            
            <Box component="ul" sx={{ mb: 3, pl: 4, color: 'text.secondary' }}>
              <li>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  With service providers who perform services on our behalf
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  To comply with legal obligations
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  To protect the rights, property, or safety of our users or the public
                </Typography>
              </li>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              4. Data Security
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}
            >
              We implement appropriate security measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              5. Your Rights
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}
            >
              Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data. To exercise these rights, please contact us.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              6. Changes to This Policy
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}
            >
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              7. Contact Us
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}
            >
              If you have any questions about this Privacy Policy, please contact us at privacy@zmyj.xyz.
            </Typography>
          </Paper>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default PrivacyPage; 