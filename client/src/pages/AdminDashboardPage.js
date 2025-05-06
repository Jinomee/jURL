import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LinkIcon from '@mui/icons-material/Link';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RefreshIcon from '@mui/icons-material/Refresh';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminUrlTable from '../components/AdminUrlTable';
import { toast } from 'react-toastify';
import urlService from '../services/urlService';

/**
 * Admin dashboard page component
 */
const AdminDashboardPage = () => {
  const [urls, setUrls] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    totalUrls: 0,
    expiredUrls: 0,
    totalClicks: 0,
  });
  
  // Fetch URLs on mount and when page/limit changes
  useEffect(() => {
    fetchUrls();
  }, [currentPage, rowsPerPage]);
  
  // Fetch URLs from the server
  const fetchUrls = async () => {
    setLoading(true);
    try {
      // Get paginated URLs
      const response = await urlService.getAllUrls(currentPage, rowsPerPage);
      setUrls(response.urls);
      setTotalItems(response.totalItems);
      
      // Get statistics from dedicated endpoint for more accurate data
      try {
        const statsResponse = await urlService.refreshStats();
        setStats({
          totalUrls: statsResponse.totalUrls,
          expiredUrls: statsResponse.expiredUrls,
          totalClicks: statsResponse.totalClicks,
        });
      } catch (statsError) {
        console.error('Error fetching stats:', statsError);
        // Fallback to calculating from current page data
        const totalClicks = response.urls.reduce(
          (sum, url) => sum + url.clickCount,
          0
        );
        const expiredUrls = response.urls.filter(
          (url) => url.expiresAt && new Date(url.expiresAt) < new Date()
        ).length;
        
        setStats({
          totalUrls: response.totalItems,
          expiredUrls,
          totalClicks,
        });
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
      toast.error('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle page change
  const handlePageChange = (page, limit) => {
    setCurrentPage(page);
    setRowsPerPage(limit);
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchUrls().finally(() => setRefreshing(false));
  };
  
  // Handle URL deletion
  const handleUrlDelete = () => {
    fetchUrls();
  };
  
  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter URLs by search term
  const filteredUrls = searchTerm
    ? urls.filter(
        (url) =>
          url.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : urls;

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
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and monitor all shortened URLs
            </Typography>
          </Box>
          
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card elevation={1}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        borderRadius: '50%',
                        width: 56,
                        height: 56,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mr: 2,
                      }}
                    >
                      <LinkIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" component="div" fontWeight="bold">
                        {loading ? <CircularProgress size={24} /> : stats.totalUrls}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total URLs
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card elevation={1}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '50%',
                        width: 56,
                        height: 56,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mr: 2,
                      }}
                    >
                      <AccessTimeIcon sx={{ color: '#EF4444', fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" component="div" fontWeight="bold">
                        {loading ? <CircularProgress size={24} /> : stats.expiredUrls}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Expired URLs
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card elevation={1}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '50%',
                        width: 56,
                        height: 56,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mr: 2,
                      }}
                    >
                      <TrendingUpIcon sx={{ color: '#10B981', fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" component="div" fontWeight="bold">
                        {loading ? <CircularProgress size={24} /> : stats.totalClicks}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Clicks
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* URL Table */}
          <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
              flexDirection={{ xs: 'column', sm: 'row' }}
              gap={2}
            >
              <Typography variant="h6" component="h2" fontWeight="bold">
                URL Management
              </Typography>
              
              <Box display="flex" gap={2} width={{ xs: '100%', sm: 'auto' }}>
                <TextField
                  placeholder="Search URLs..."
                  size="small"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: { xs: '100%', sm: 240 } }}
                />
                
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  Refresh
                </Button>
              </Box>
            </Box>
            
            <AdminUrlTable
              urls={filteredUrls}
              totalItems={
                searchTerm ? filteredUrls.length : totalItems
              }
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onDelete={handleUrlDelete}
              loading={loading}
            />
          </Paper>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default AdminDashboardPage;