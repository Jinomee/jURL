import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Switch,
  Collapse,
  InputAdornment,
  Alert,
  FormHelperText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Fade,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import urlService from '../services/urlService';

/**
 * URL shortening form component - minimalistic design
 */
const UrlForm = () => {
  const [showCustomOptions, setShowCustomOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [customCodeError, setCustomCodeError] = useState('');
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      originalUrl: '',
      customCode: '',
      expireDuration: {
        value: '',
        unit: 'hours'
      }
    },
  });

  // Clear custom code error when user changes input
  const handleCustomCodeChange = (event, onChange) => {
    if (customCodeError) {
      setCustomCodeError('');
    }
    onChange(event);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    setCustomCodeError(''); // Clear any previous errors
    
    try {
      // Prepare the URL data
      const urlData = {
        originalUrl: data.originalUrl,
      };
      
      // Add custom code if provided
      if (data.customCode) {
        urlData.customCode = data.customCode;
      }
      
      // Add expiration duration if provided
      if (data.expireDuration && data.expireDuration.value) {
        urlData.expireDuration = {
          value: parseInt(data.expireDuration.value),
          unit: data.expireDuration.unit
        };
      }
      
      const response = await urlService.createUrl(urlData);
      setShortenedUrl(response);
      toast.success('URL shortened successfully!');
      
      // Reset form
      reset();
    } catch (error) {
      console.error('Error creating shortened URL:', error);
      
      // Extract error message from the response
      let errorMessage;
      
      if (error.response?.data) {
        // Check if the error is about custom code
        if (error.response.data.message && error.response.data.message.includes('custom code')) {
          setCustomCodeError(error.response.data.message);
          errorMessage = error.response.data.message;
          // Show a more prominent toast for custom code errors
          toast.error(errorMessage, {
            autoClose: 5000, // Show longer
            position: "top-center", // More prominent position
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'custom-code-error-toast',
          });
          return; // Early return to avoid showing another toast
        } 
        // Check if there's a specific customCode error
        else if (error.response.data.errors?.customCode) {
          setCustomCodeError(error.response.data.errors.customCode);
          errorMessage = error.response.data.errors.customCode;
          // Show a more prominent toast for custom code errors
          toast.error(errorMessage, {
            autoClose: 5000, // Show longer
            position: "top-center", // More prominent position
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'custom-code-error-toast',
          });
          return; // Early return to avoid showing another toast
        }
        // Use the general message if available
        else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      // Default message if nothing specific was found
      if (!errorMessage) {
        errorMessage = 'Failed to create shortened URL. Please try again.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    setCopied(true);
    toast.info('URL copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  // Handle creating new URL
  const handleCreateNew = () => {
    setShortenedUrl(null);
  };

  return (
    <Card 
      elevation={0} 
      sx={{ 
        width: '100%', 
        maxWidth: 600, 
        mx: 'auto', 
        borderRadius: '16px',
        backgroundColor: 'white',
        transition: 'all 0.3s ease',
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        {!shortenedUrl ? (
          // URL Shortening Form
          <Fade in={!shortenedUrl}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom 
                fontWeight="600" 
                sx={{ 
                  mb: 3, 
                  color: 'text.primary',
                  textAlign: 'center'
                }}
              >
                Shorten Your URL
              </Typography>
              
              {/* Original URL Input */}
              <Controller
                name="originalUrl"
                control={control}
                rules={{
                  required: 'URL is required',
                  pattern: {
                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                    message: 'Please enter a valid URL',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Enter URL to shorten"
                    variant="outlined"
                    fullWidth
                    error={!!errors.originalUrl}
                    helperText={errors.originalUrl?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                      sx: { 
                        borderRadius: '12px', 
                        fontSize: '0.95rem',
                        py: 0.5,
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
                        }
                      }
                    }}
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.08)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                      },
                    }}
                  />
                )}
              />
              
              {/* Custom Options Toggle */}
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showCustomOptions}
                      onChange={(e) => setShowCustomOptions(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Advanced options
                    </Typography>
                  }
                />
              </Box>
              
              {/* Advanced Options */}
              <Collapse in={showCustomOptions}>
                <Box 
                  sx={{ 
                    mt: 1, 
                    mb: 3, 
                    p: 2, 
                    borderRadius: '12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.01)',
                  }}
                >
                  {/* Custom Code Input */}
                  <Controller
                    name="customCode"
                    control={control}
                    rules={{
                      minLength: {
                        value: 3,
                        message: 'Custom code must be at least 3 characters',
                      },
                      maxLength: {
                        value: 20,
                        message: 'Custom code cannot exceed 20 characters',
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9-_]*$/,
                        message: 'Only letters, numbers, hyphens, and underscores are allowed',
                      },
                    }}
                    render={({ field }) => (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary', fontSize: '0.8125rem', fontWeight: 500 }}>
                          Custom URL ending (optional)
                        </Typography>
                        <Box sx={{ 
                          position: 'relative', 
                          width: '100%', 
                          borderRadius: '12px',
                          display: 'flex',
                          overflow: 'hidden',
                          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                          backgroundColor: 'white',
                          border: customCodeError 
                            ? '1px solid #d32f2f' 
                            : '1px solid rgba(0, 0, 0, 0.06)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: customCodeError 
                              ? '#d32f2f' 
                              : 'rgba(0, 0, 0, 0.1)',
                            boxShadow: customCodeError
                              ? '0 0 0 1px rgba(211, 47, 47, 0.2)'
                              : '0 2px 4px rgba(15, 23, 42, 0.08)',
                          },
                          ...(!!errors.customCode && {
                            borderColor: 'error.main',
                            boxShadow: '0 0 0 1px rgba(220, 38, 38, 0.2)',
                          })
                        }}>
                          <div style={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            color: 'rgba(0, 0, 0, 0.5)',
                            padding: '0 12px',
                            display: 'flex', 
                            alignItems: 'center',
                            borderRight: '1px solid rgba(0, 0, 0, 0.04)',
                            whiteSpace: 'nowrap',
                            height: '48px',
                            fontSize: '0.8125rem',
                            boxSizing: 'border-box'
                          }}>
                            {window.location.origin}/
                          </div>
                          <input 
                            {...field}
                            placeholder="my-custom-url"
                            onChange={(e) => {
                              handleCustomCodeChange(e, field.onChange);
                            }}
                            style={{
                              border: 'none',
                              outline: 'none',
                              padding: '0 12px',
                              height: '48px',
                              boxSizing: 'border-box',
                              fontSize: '0.8125rem',
                              width: '100%',
                              fontFamily: '"Inter", "Roboto", sans-serif',
                              color: '#1E293B',
                              backgroundColor: 'transparent',
                            }}
                          />
                        </Box>
                        {errors.customCode && (
                          <FormHelperText error sx={{ fontSize: '0.75rem', mt: 0.5 }}>{errors.customCode.message}</FormHelperText>
                        )}
                        {customCodeError && !errors.customCode && (
                          <FormHelperText error sx={{ 
                            fontSize: '0.8rem', 
                            mt: 0.5, 
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <span style={{ color: '#d32f2f', fontSize: '1rem' }}>⚠</span>
                            {customCodeError}
                          </FormHelperText>
                        )}
                      </Box>
                    )}
                  />
                  
                  {/* Expiration Timer Input */}
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary', fontSize: '0.8125rem', fontWeight: 500 }}>
                    Set expiration time (optional)
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Controller
                        name="expireDuration.value"
                        control={control}
                        rules={{
                          min: {
                            value: 1,
                            message: 'Value must be at least 1'
                          },
                          pattern: {
                            value: /^[0-9]*$/,
                            message: 'Value must be a number'
                          }
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            placeholder="Duration"
                            variant="outlined"
                            fullWidth
                            type="number"
                            inputProps={{ 
                              min: 1,
                              sx: { 
                                fontSize: '0.8125rem',
                                padding: '12px',
                              }
                            }}
                            InputProps={{
                              sx: { borderRadius: '12px' }
                            }}
                            error={!!errors.expireDuration?.value}
                            helperText={errors.expireDuration?.value?.message}
                            sx={{ 
                              '& .MuiFormHelperText-root': { fontSize: '0.75rem' },
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(0, 0, 0, 0.08)',
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Controller
                        name="expireDuration.unit"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth variant="outlined">
                            <Select
                              {...field}
                              displayEmpty
                              inputProps={{ 
                                sx: { 
                                  borderRadius: '12px',
                                  fontSize: '0.8125rem',
                                  padding: '12px',
                                }
                              }}
                              sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(0, 0, 0, 0.08)',
                                },
                              }}
                            >
                              <MenuItem value="minutes">Minutes</MenuItem>
                              <MenuItem value="hours">Hours</MenuItem>
                              <MenuItem value="days">Days</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
              
              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ 
                  mt: 2, 
                  py: 1.5,
                  borderRadius: '12px',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  boxShadow: '0 1px 3px rgba(79, 70, 229, 0.2)',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(79, 70, 229, 0.25)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
                disabled={loading}
              >
                {loading ? 'Shortening...' : 'Shorten URL'}
              </Button>
            </Box>
          </Fade>
        ) : (
          // URL Shortened Result
          <Fade in={!!shortenedUrl}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h5" 
                component="h2" 
                fontWeight="600" 
                sx={{ 
                  mb: 3,
                  color: 'text.primary',
                }}
              >
                Your Shortened URL
              </Typography>
              
              <Alert
                severity="success"
                icon={false}
                sx={{
                  my: 3,
                  py: 3,
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(79, 70, 229, 0.08)',
                  color: 'primary.dark',
                  border: 'none',
                  borderRadius: '14px',
                  '& .MuiAlert-message': {
                    width: '100%',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    gap: 2,
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    wordBreak: 'break-all',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
                    backgroundColor: 'white',
                    flexGrow: 1,
                    width: { xs: '100%', sm: 'auto' },
                  }}>
                    <div style={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      color: 'rgba(0, 0, 0, 0.5)',
                      padding: '0 12px',
                      display: 'flex', 
                      alignItems: 'center',
                      borderRight: '1px solid rgba(0, 0, 0, 0.04)',
                      whiteSpace: 'nowrap',
                      height: '48px',
                      fontSize: '0.8125rem',
                      boxSizing: 'border-box'
                    }}>
                      {new URL(shortenedUrl.shortUrl).origin}/
                    </div>
                    <a
                      href={shortenedUrl.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        textDecoration: 'none', 
                        fontWeight: '500',
                        color: '#1E293B',
                        padding: '0 12px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.875rem',
                        flexGrow: 1,
                      }}
                    >
                      {shortenedUrl.shortCode}
                    </a>
                  </Box>
                  
                  <CopyToClipboard text={shortenedUrl.shortUrl} onCopy={handleCopy}>
                    <Button
                      variant={copied ? 'contained' : 'outlined'}
                      color={copied ? 'primary' : 'primary'}
                      startIcon={<ContentCopyIcon sx={{ fontSize: 16 }} />}
                      sx={{ 
                        borderRadius: '12px',
                        py: 1.5,
                        width: { xs: '100%', sm: 'auto' },
                        minWidth: { sm: '120px' },
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {copied ? 'Copied!' : 'Copy URL'}
                    </Button>
                  </CopyToClipboard>
                </Box>
              </Alert>
              
              <Box sx={{ 
                mt: 2, 
                mb: 3,
                py: 2,
                px: 3,
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.01)',
                border: '1px solid rgba(0, 0, 0, 0.04)',
                textAlign: 'left'
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.8125rem', fontWeight: 500 }}>
                  Original URL
                </Typography>
                <Typography variant="body2" sx={{ 
                  wordBreak: 'break-all', 
                  fontSize: '0.8125rem',
                  color: 'text.primary',
                }}>
                  {shortenedUrl.originalUrl}
                </Typography>
                
                {shortenedUrl.expiresAt && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.04)' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.8125rem', fontWeight: 500 }}>
                      Expires
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.primary' }}>
                      {new Date(shortenedUrl.expiresAt).toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Button
                variant="text"
                color="primary"
                onClick={handleCreateNew}
                sx={{ 
                  mt: 1,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(79, 70, 229, 0.04)',
                  },
                }}
              >
                Shorten Another URL
              </Button>
            </Box>
          </Fade>
        )}
      </CardContent>
    </Card>
  );
};

export default UrlForm;