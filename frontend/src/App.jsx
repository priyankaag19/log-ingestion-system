import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import FilterBar from './components/FilterBar';
import LogList from './components/LogList';
import { fetchLogs } from './services/api';

const INITIAL_FILTERS = {
  level: '',
  message: '',
  resourceId: '',
  timestamp: '',
  traceId: '',
  spanId: '',
  commit: ''
};

function App() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // Load logs with optional query parameters
  const loadLogs = useCallback(async (queryParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchLogs(queryParams);
      setLogs(response);
      setFilteredLogs(response);
    } catch (err) {
      setError('Failed to load logs. Please try again.');
      console.error('Error loading logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply filters and fetch filtered logs
  const applyFilters = useCallback(async () => {
    const queryParams = {};

    // Build query params from active filters
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key].trim() !== '') {
        queryParams[key] = filters[key];
      }
    });

    await loadLogs(queryParams);
  }, [filters, loadLogs]);

  // Initial load
  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const handleRefresh = useCallback(() => {
    loadLogs();
  }, [loadLogs]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1">
            📊 Log Viewer
          </Typography>
          <Button
            variant="outlined"
            onClick={handleRefresh}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            🔄 Refresh
          </Button>
        </Stack>
      </Paper>

      {/* Main Content */}
      <Stack spacing={3}>
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onLogAdded={handleRefresh}
        />

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading Spinner or Log List */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <LogList logs={filteredLogs} />
        )}
      </Stack>
    </Container>
  );
}

export default App;