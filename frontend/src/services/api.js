import axios from 'axios';

// ✅ Use import.meta.env for Vite environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);

    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }

    if (error.response) {
      const { status, data } = error.response;
      throw new Error(data.message || `Server error: ${status}`);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
);

/**
 * Fetch logs with optional query parameters
 * @param {Object} queryParams - Filter parameters
 * @returns {Promise<Array>} Array of log entries
 */
export const fetchLogs = async (queryParams = {}) => {
  try {
    const response = await api.get('/logs', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
};

/**
 * Ingest a single log entry
 * @param {Object} logEntry - Log entry object
 * @returns {Promise<Object>} Created log entry
 */
export const ingestLog = async (logEntry) => {
  try {
    const response = await api.post('/logs', logEntry);
    return response.data;
  } catch (error) {
    console.error('Error ingesting log:', error);
    throw error;
  }
};

/**
 * Health check endpoint
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};

export default api;
