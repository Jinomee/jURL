import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4F46E5',
      light: '#818CF8',
      dark: '#3730A3',
      contrastText: '#fff',
    },
    secondary: {
      main: '#94A3B8',
      light: '#CBD5E1',
      dark: '#64748B',
      contrastText: '#fff',
    },
    background: {
      default: '#F8FAFC',
      paper: '#ffffff',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
    divider: 'rgba(0, 0, 0, 0.06)',
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      letterSpacing: '-0.025em',
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.6,
    },
    subtitle1: {
      fontSize: '0.9375rem',
      lineHeight: 1.5,
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(15, 23, 42, 0.04)',
    '0px 2px 4px rgba(15, 23, 42, 0.06)',
    '0px 4px 8px rgba(15, 23, 42, 0.08)',
    '0 5px 10px rgba(15, 23, 42, 0.1)',
    '0 5px 10px rgba(15, 23, 42, 0.1)',
    '0 5px 10px rgba(15, 23, 42, 0.1)',
    '0 5px 10px rgba(15, 23, 42, 0.1)',
    '0 5px 10px rgba(15, 23, 42, 0.1)',
    '0 5px 10px rgba(15, 23, 42, 0.1)',
    '0 5px 10px rgba(15, 23, 42, 0.1)',
    '0 5px 10px rgba(15, 23, 42, 0.1)',
    '0 5px 10px rgba(15, 23, 42, 0.1)',
    '0 5px 10px rgba(15, 23, 42, 0.1)',
    '0 5px 10px rgba(15, 23, 42, 0.1)',
    '0 5px 10px rgba(15, 23, 42, 0.1)',
    '0 5px 10px rgba(15, 23, 42, 0.1)',
    '0 5px 10px rgba(15, 23, 42, 0.1)',
    '0 5px 10px rgba(15, 23, 42, 0.1)',
    '0 5px 10px rgba(15, 23, 42, 0.1)',
    '0 5px 10px rgba(15, 23, 42, 0.1)',
    '0 5px 10px rgba(15, 23, 42, 0.1)',
    '0 5px 10px rgba(15, 23, 42, 0.1)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#F1F5F9',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#CBD5E1',
            borderRadius: '3px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          boxShadow: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(15, 23, 42, 0.08)',
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease',
          },
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#4A5568',
          },
        },
        outlinedPrimary: {
          borderWidth: '1px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          border: 'none'
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f7fafc',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #EDF2F7',
          padding: '12px 16px',
        },
        head: {
          fontWeight: 600,
          color: '#4A5568',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
  },
});

export default theme;