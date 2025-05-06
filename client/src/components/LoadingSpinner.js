import React from 'react';
import { Box, CircularProgress } from '@mui/material';

/**
 * Loading spinner component - minimalistic design
 */
const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        minHeight: '150px',
        flexDirection: 'column',
      }}
    >
      <CircularProgress 
        size={32}
        thickness={2.5}
        sx={{ 
          color: 'primary.main',
          opacity: 0.75,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }} 
      />
    </Box>
  );
};

export default LoadingSpinner;