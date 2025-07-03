import React, { useState, useEffect } from 'react';
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

function App() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    level: '',
    message: '',
    resourceId: '',
    timestamp: '',
    traceId: '',
    spanId: '',
    commit: ''
  });

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, logs]);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchLogs();
      setLogs(response);
      setFilteredLogs(response);
    } catch (err) {
      setError('Failed to load logs. Please try again.');
      console.error('Error loading logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key].trim() !== '') {
          queryParams[key] = filters[key];
        }
      });
      const response = await fetchLogs(queryParams);
      setFilteredLogs(response);
    } catch (err) {
      setError('Failed to filter logs. Please try again.');
      console.error('Error filtering logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      level: '',
      message: '',
      resourceId: '',
      timestamp: '',
      traceId: '',
      spanId: '',
      commit: ''
    });
  };

  const handleRefresh = () => {
    loadLogs();
  };

  return (
    <Box minHeight="100vh" bgcolor="grey.100">
      {/* Header */}
      <Paper elevation={1} square>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" py={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h5" fontWeight={600}>
                Log Viewer
              </Typography>
              <Chip label={`${filteredLogs.length} logs`} color="primary" size="small" />
            </Box>

            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={handleRefresh}>
                🔄 Refresh
              </Button>
            </Stack>
          </Box>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onLogAdded={loadLogs}
        />

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading Spinner or Log List */}
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <LogList logs={filteredLogs} />
        )}
      </Container>
    </Box>
  );
}

export default App;
