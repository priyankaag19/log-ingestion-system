import React, { useState, useEffect } from 'react';
import { Grid, TextField, InputAdornment, IconButton, Button, Typography, Paper } from '@mui/material';
import { FiSearch } from 'react-icons/fi';

const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
  const [searchTerm, setSearchTerm] = useState(filters.message || '');

  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date)) return '';
    return date.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange('message', searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, onFilterChange]);

  const handleInputChange = (field, value) => {
    if (field === 'message') {
      setSearchTerm(value);
    } else {
      onFilterChange(field, value);
    }
  };

  const hasActiveFilters = Object.values(filters).some((v) => v && v.trim() !== '');

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

      <Grid container spacing={2}>
        {/* Search Message */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            label="Search Message"
            value={filters.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
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

        {/* Level Filter */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            select
            placeholder="Level"
            value={filters.level}
            onChange={(e) => handleInputChange('level', e.target.value)}
            SelectProps={{
              native: true,
            }}
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
            value={filters.resourceId}
            onChange={(e) => handleInputChange('resourceId', e.target.value)}
            placeholder="e.g., server-1234"
          />
        </Grid>

        {/* Timestamp Start */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            type="datetime-local"
            label="From Date"
            value={formatDateTimeLocal(filters.timestamp_start)}
            onChange={(e) =>
              handleInputChange('timestamp_start', e.target.value ? new Date(e.target.value).toISOString() : '')
            }
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Timestamp End */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            type="datetime-local"
            label="To Date"
            value={formatDateTimeLocal(filters.timestamp_end)}
            onChange={(e) =>
              handleInputChange('timestamp_end', e.target.value ? new Date(e.target.value).toISOString() : '')
            }
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Trace ID */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            label="Trace ID"
            value={filters.traceId}
            onChange={(e) => handleInputChange('traceId', e.target.value)}
            placeholder="e.g., abc-xyz-123"
          />
        </Grid>

        {/* Span ID */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            label="Span ID"
            value={filters.spanId}
            onChange={(e) => handleInputChange('spanId', e.target.value)}
            placeholder="e.g., span-456"
          />
        </Grid>

        {/* Commit Hash */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            fullWidth
            label="Commit Hash"
            value={filters.commit}
            onChange={(e) => handleInputChange('commit', e.target.value)}
            placeholder="e.g., 5e5342f"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FilterBar;
