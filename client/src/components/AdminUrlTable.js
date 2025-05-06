import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Button,
  Typography,
  Chip,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  alpha,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import urlService from '../services/urlService';

/**
 * Admin URL table component
 */
const AdminUrlTable = ({ urls, totalItems, currentPage, onPageChange, onDelete, loading }) => {
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState(null);
  const [copiedUrlId, setCopiedUrlId] = useState(null);
  
  // Handle copy to clipboard
  const handleCopy = (id) => {
    setCopiedUrlId(id);
    toast.info('URL copied to clipboard!');
    setTimeout(() => setCopiedUrlId(null), 2000);
  };
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    onPageChange(newPage + 1, rowsPerPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    onPageChange(1, newRowsPerPage);
  };
  
  // Open delete confirmation dialog
  const handleDeleteClick = (url) => {
    setUrlToDelete(url);
    setDeleteDialogOpen(true);
  };
  
  // Close delete confirmation dialog
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setUrlToDelete(null);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (urlToDelete) {
      try {
        await urlService.deleteUrl(urlToDelete.id);
        toast.success('URL deleted successfully');
        onDelete();
      } catch (error) {
        console.error('Error deleting URL:', error);
        toast.error('Failed to delete URL');
      } finally {
        handleDeleteDialogClose();
      }
    }
  };
  
  // Check if URL is expired
  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };
  
  // Edit URL
  const handleEditClick = (id) => {
    navigate(`/admin/urls/${id}`);
  };

  return (
    <>
      <TableContainer 
        component={Paper} 
        elevation={0} 
        sx={{ 
          borderRadius: '14px',
          overflow: 'hidden',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          boxShadow: '0px 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ 
                py: 2.5, 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: 'text.secondary',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Short URL
              </TableCell>
              <TableCell sx={{ 
                py: 2.5, 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: 'text.secondary',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Original URL
              </TableCell>
              <TableCell sx={{ 
                py: 2.5, 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: 'text.secondary',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Created
              </TableCell>
              <TableCell sx={{ 
                py: 2.5, 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: 'text.secondary',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Expires
              </TableCell>
              <TableCell sx={{ 
                py: 2.5, 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: 'text.secondary',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Clicks
              </TableCell>
              <TableCell sx={{ 
                py: 2.5, 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: 'text.secondary',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.length > 0 ? (
              urls.map((url) => (
                <TableRow 
                  key={url.id} 
                  hover
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: alpha('#4F46E5', 0.04),
                    },
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mr: 1, 
                          fontWeight: 500,
                          color: 'text.primary',
                        }}
                      >
                        {url.shortCode}
                      </Typography>
                      <CopyToClipboard text={url.shortUrl} onCopy={() => handleCopy(url.id)}>
                        <Tooltip title={copiedUrlId === url.id ? 'Copied!' : 'Copy URL'}>
                          <IconButton 
                            size="small" 
                            color={copiedUrlId === url.id ? 'primary' : 'default'}
                            sx={{ 
                              p: 0.5,
                              '&:hover': {
                                backgroundColor: alpha('#4F46E5', 0.08),
                              },
                            }}
                          >
                            <ContentCopyIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </CopyToClipboard>
                      {url.isCustom && (
                        <Chip
                          label="Custom"
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ 
                            ml: 1, 
                            height: 20, 
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            borderRadius: '4px',
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 250,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: 'text.secondary',
                      }}
                    >
                      {url.originalUrl}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Typography 
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.8125rem',
                      }}
                    >
                      {new Date(url.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    {url.expiresAt ? (
                      <Chip
                        label={
                          isExpired(url.expiresAt)
                            ? 'Expired'
                            : new Date(url.expiresAt).toLocaleDateString()
                        }
                        size="small"
                        color={isExpired(url.expiresAt) ? 'error' : 'success'}
                        sx={{ 
                          height: 24, 
                          fontSize: '0.6875rem',
                          fontWeight: 500,
                          borderRadius: '6px',
                          backgroundColor: isExpired(url.expiresAt) 
                            ? alpha('#EF4444', 0.1)
                            : alpha('#10B981', 0.1),
                          color: isExpired(url.expiresAt) 
                            ? '#EF4444' 
                            : '#10B981',
                          border: 'none',
                        }}
                      />
                    ) : (
                      <Typography 
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.8125rem',
                        }}
                      >
                        Never
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Typography 
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: 'text.primary',
                      }}
                    >
                      {url.clickCount}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex' }}>
                      <Tooltip title="Edit URL">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEditClick(url.id)}
                          sx={{ 
                            mr: 1,
                            '&:hover': {
                              backgroundColor: alpha('#4F46E5', 0.08),
                            },
                          }}
                        >
                          <EditIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete URL">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteClick(url)}
                          sx={{ 
                            '&:hover': {
                              backgroundColor: alpha('#EF4444', 0.08),
                            },
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No URLs found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <TablePagination
        component="div"
        count={totalItems || 0}
        page={(currentPage || 1) - 1}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{ 
          borderTop: 'none',
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontSize: '0.8125rem',
            color: 'text.secondary',
          },
          '.MuiTablePagination-select': {
            fontSize: '0.8125rem',
          },
        }}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        PaperProps={{
          sx: {
            borderRadius: '14px',
            padding: 1,
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: '1.25rem', 
          fontWeight: 600,
          pb: 1, 
          color: 'text.primary' 
        }}>
          Delete URL?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '0.9375rem', color: 'text.secondary' }}>
            Are you sure you want to delete the shortened URL{' '}
            <b>{urlToDelete?.shortCode}</b>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleDeleteDialogClose} 
            color="inherit"
            variant="outlined"
            sx={{ 
              borderRadius: '10px',
              fontWeight: 500,
              textTransform: 'none',
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            sx={{ 
              ml: 1,
              borderRadius: '10px',
              fontWeight: 500,
              textTransform: 'none',
              px: 3,
              boxShadow: 'none',
              backgroundColor: '#EF4444',
              '&:hover': {
                backgroundColor: '#DC2626',
                boxShadow: '0 4px 8px rgba(239, 68, 68, 0.25)',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminUrlTable;