import api from './api';

/**
 * Service for URL-related API operations
 */
const urlService = {
  /**
   * Create a new shortened URL
   * @param {object} urlData - URL data
   * @returns {Promise<object>} - Created URL data
   */
  createUrl: async (urlData) => {
    const response = await api.post('/urls', urlData);
    return response.data;
  },

  /**
   * Get all URLs with pagination (admin only)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<object>} - Paginated URLs
   */
  getAllUrls: async (page = 1, limit = 10) => {
    const response = await api.get('/urls', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get a URL by ID (admin only)
   * @param {string} id - URL ID
   * @returns {Promise<object>} - URL data
   */
  getUrlById: async (id) => {
    const response = await api.get(`/urls/${id}`);
    return response.data;
  },

  /**
   * Update a URL (admin only)
   * @param {string} id - URL ID
   * @param {object} urlData - New URL data
   * @returns {Promise<object>} - Updated URL data
   */
  updateUrl: async (id, urlData) => {
    const response = await api.put(`/urls/${id}`, urlData);
    return response.data;
  },

  /**
   * Delete a URL (admin only)
   * @param {string} id - URL ID
   * @returns {Promise<object>} - Success message
   */
  deleteUrl: async (id) => {
    const response = await api.delete(`/urls/${id}`);
    return response.data;
  },

  /**
   * Refresh URL statistics (admin only)
   * @returns {Promise<object>} - URL statistics
   */
  refreshStats: async () => {
    const response = await api.get('/urls/stats');
    return response.data;
  },

  /**
   * Refresh a specific URL's statistics (admin only)
   * @param {string} id - URL ID
   * @returns {Promise<object>} - URL with refreshed statistics
   */
  refreshUrlStats: async (id) => {
    const response = await api.get(`/urls/refresh/${id}`);
    return response.data;
  },
};

export default urlService;