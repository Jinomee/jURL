import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  IconButton,
  Link,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import urlService from '../services/urlService';
import Header from '../components/Header';
import Footer from '../components/Footer';

/**
 * Admin URL details page component
 */
const AdminUrlDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    originalUrl: '',
    expiresAt: null,
  });
  const [errors, setErrors] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Fetch URL details on mount
  useEffect(() => {
    fetchUrl();
  }, [id]);
  
  // Fetch URL details
  const fetchUrl = async () => {
    setLoading(true);
    try {
      const data = await urlService.getUrlById(id);
      setUrl(data);
      setFormData({
        originalUrl: data.originalUrl,
        expiresAt: data.expiresAt ? dayjs(data.expiresAt) : null,
      });
    } catch (error) {
      console.error('Error fetching URL details:', error);
      toast.error('Failed to load URL details');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };
  
  // Handle expiration date change
  const handleExpiresAtChange = (date) => {
    setFormData({
      ...formData,
      expiresAt: date,
    });
    
    // Clear error for this field
    if (errors.expiresAt) {
      setErrors({
        ...errors,
        expiresAt: null,
      });
    }
  };
  
  // Clear expiration date
  const handleClearExpiration = () => {
    setFormData({
      ...formData,
      expiresAt: null,
    });
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate originalUrl
    if (!formData.originalUrl) {
      newErrors.originalUrl = 'Original URL is required';
    } else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.originalUrl)) {
      newErrors.originalUrl = 'Please enter a valid URL';
    }
    
    // Validate expiresAt
    if (formData.expiresAt && formData.expiresAt.isBefore(dayjs())) {
      newErrors.expiresAt = 'Expiration date must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    try {
      // Prepare data for API
      const updateData = {
        originalUrl: formData.originalUrl,
        expiresAt: formData.expiresAt ? formData.expiresAt.toISOString() : null,
      };
      
      // Update URL
      const updatedUrl = await urlService.updateUrl(id, updateData);
      setUrl(updatedUrl);
      
      toast.success('URL updated successfully');
    } catch (error) {
      console.error('Error updating URL:', error);
      toast.error('Failed to update URL');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    try {
      await urlService.deleteUrl(id);
      toast.success('URL deleted successfully');
      navigate('/admin');
    } catch (error) {
      console.error('Error deleting URL:', error);
      toast.error('Failed to delete URL');
    } finally {
      setDeleteDialogOpen(false);
    }
  };
  
  // Handle copy to clipboard
  const handleCopy = () => {
    setCopied(true);
    toast.info('URL copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };
  
  // Check if URL is expired
  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header isAdmin={true} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          backgroundColor: (theme) => theme.palette.grey[50],
        }}
      >
        <Container maxWidth="lg">
          {/* Page Header */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={() => navigate('/admin')}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" fontWeight="bold">
              URL Details
            </Typography>
          </Box>
          
          {loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress />
            </Box>
          ) : url ? (
            <Grid container spacing={4}>
              {/* URL Info Card */}
              <Grid item xs={12} md={4}>
                <Card elevation={1}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" component="h2" fontWeight="bold" gutterBottom>
                      URL Information
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Short Code
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body1" fontWeight="medium">
                          {url.shortCode}
                        </Typography>
                        {url.isCustom && (
                          <Chip
                            label="Custom"
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ ml: 1, height: 20 }}
                          />
                        )}
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Short URL
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <Link
                          href={url.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                          sx={{ 
                            mr: 1, 
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block'
                          }}
                        >
                          {url.shortUrl}
                        </Link>
                        <CopyToClipboard text={url.shortUrl} onCopy={handleCopy}>
                          <IconButton size="small" color={copied ? 'success' : 'default'}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </CopyToClipboard>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Created At
                      </Typography>
                      <Typography variant="body1">
                        {new Date(url.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Expires At
                      </Typography>
                      {url.expiresAt ? (
                        <Chip
                          label={
                            isExpired(url.expiresAt)
                              ? 'Expired'
                              : new Date(url.expiresAt).toLocaleString()
                          }
                          size="small"
                          color={isExpired(url.expiresAt) ? 'error' : 'success'}
                        />
                      ) : (
                        <Typography variant="body1">Never</Typography>
                      )}
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Click Count
                      </Typography>
                      <Typography variant="h5" component="div" fontWeight="bold" color="primary">
                        {url.clickCount}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Edit Form */}
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" component="h2" fontWeight="bold" gutterBottom>
                    Edit URL
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  
                  <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                      name="originalUrl"
                      label="Original URL"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={formData.originalUrl}
                      onChange={handleChange}
                      error={!!errors.originalUrl}
                      helperText={errors.originalUrl}
                      disabled={saving}
                    />
                    
                    <Box sx={{ mt: 3, mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Expiration Date (optional)
                      </Typography>
                      
                      <Box display="flex" alignItems="center" gap={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateTimePicker
                            value={formData.expiresAt}
                            onChange={handleExpiresAtChange}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                variant: 'outlined',
                                error: !!errors.expiresAt,
                                helperText: errors.expiresAt,
                                disabled: saving,
                              },
                            }}
                          />
                        </LocalizationProvider>
                        
                        <Button
                          variant="outlined"
                          onClick={handleClearExpiration}
                          disabled={!formData.expiresAt || saving}
                        >
                          Clear
                        </Button>
                      </Box>
                    </Box>
                    
                    <Box 
                      display="flex" 
                      justifyContent="space-between"
                      gap={2}
                      mt={4}
                    >
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => setDeleteDialogOpen(true)}
                        disabled={saving}
                      >
                        Delete URL
                      </Button>
                      
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                URL not found
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/admin')}
                sx={{ mt: 2 }}
              >
                Back to Dashboard
              </Button>
            </Paper>
          )}
        </Container>
      </Box>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this URL? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      <Footer />
    </Box>
  );
};

export default AdminUrlDetailsPage;