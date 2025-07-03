import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  InputAdornment,
  Button,
  Typography,
  Paper,
  Alert
} from '@mui/material';
import { FiSearch } from 'react-icons/fi';
import { ingestLog } from '../services/api';

const FilterBar = ({ filters, onFilterChange, onClearFilters, onLogAdded }) => {
  const [searchTerm, setSearchTerm] = useState(filters.message || '');
  const [formData, setFormData] = useState({
    level: '',
    message: '',
    resourceId: '',
    timestamp: '',
    traceId: '',
    spanId: '',
    commit: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange('message', searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, onFilterChange]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date)) return '';
    return date.toISOString().slice(0, 16);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v && v.trim() !== '');

  const handleSubmit = async () => {
    const requiredFields = ['level', 'resourceId', 'timestamp', 'traceId', 'spanId', 'commit'];
    const emptyField = requiredFields.find(field => !formData[field] || formData[field].trim() === '');
    if (emptyField) {
      setError(`Please fill out the "${emptyField}" field.`);
      return;
    }

    try {
      const payload = {
        ...formData,
        timestamp: new Date(formData.timestamp).toISOString(),
        message: formData.message || 'New Sample Added',
        metadata: {
          parentResourceId: formData.resourceId || 'unknown-parent',
        }
      };

      await ingestLog(payload);
      if (onLogAdded) onLogAdded();
      useEffect(() => {
        const allEmpty = Object.values(filters).every((v) => v === '');
        if (allEmpty) {
          setFormData({
            level: '',
            message: '',
            resourceId: '',
            timestamp: '',
            traceId: '',
            spanId: '',
            commit: ''
          });
          setSearchTerm('');
        }
      }, [filters]);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to add log.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Filter Logs</Typography>
        {hasActiveFilters && (
          <Button variant="outlined" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* Message Search */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            label="Search Message"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search in log messages..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch size={20} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Level */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            select
            placeholder="Level"
            value={formData.level}
            onChange={(e) => handleInputChange('level', e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value="">All Levels</option>
            <option value="error">Error</option>
            <option value="warn">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </TextField>
        </Grid>

        {/* Resource ID */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            label="Resource ID"
            placeholder="e.g., server-1234"
            value={formData.resourceId}
            onChange={(e) => handleInputChange('resourceId', e.target.value)}
          />
        </Grid>

        {/* Timestamp */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            type="datetime-local"
            label="Timestamp"
            value={formData.timestamp}
            onChange={(e) => handleInputChange('timestamp', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Trace ID */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            label="Trace ID"
            placeholder="e.g., abc-xyz-123"
            value={formData.traceId}
            onChange={(e) => handleInputChange('traceId', e.target.value)}
          />
        </Grid>

        {/* Span ID */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            label="Span ID"
            value={formData.spanId}
            placeholder="e.g., span-456"
            onChange={(e) => handleInputChange('spanId', e.target.value)}
          />
        </Grid>

        {/* Commit */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            label="Commit Hash"
            value={formData.commit}
            placeholder="e.g., 5e5342f"
            onChange={(e) => handleInputChange('commit', e.target.value)}
          />
        </Grid>
      </Grid>

      <Button
        sx={{ mt: 3 }}
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        Submit Log
      </Button>
    </Paper>
  );
};

export default FilterBar;
