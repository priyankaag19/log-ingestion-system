import React, { useState } from 'react';
import {
  Box,
  Chip,
  Typography,
  Grid,
  Divider,
  IconButton,
  Paper,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { format } from 'date-fns';

const LogEntry = ({ log }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getLevelColor = (level) => {
    switch (level) {
      case 'error':
        return 'error';
      case 'warn':
        return 'warning';
      case 'info':
        return 'info';
      case 'debug':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss');
    } catch (error) {
      return timestamp;
    }
  };

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderLeft: '6px solid',
        borderLeftColor: {
          error: '#f44336',
          warning: '#ff9800',
          info: '#2196f3',
          debug: '#9e9e9e',
        }[log.level] || '#9e9e9e',
        mb: 2,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box flex={1}>
          {/* Top Row */}
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <Chip
              label={log.level.toUpperCase()}
              size="small"
              color={getLevelColor(log.level)}
            />
            <Typography variant="body2" color="text.secondary">
              {formatTimestamp(log.timestamp)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {log.resourceId}
            </Typography>
          </Box>

          {/* Message */}
          <Typography variant="body1" fontWeight={500} gutterBottom>
            {log.message}
          </Typography>

          {/* Info Row */}
          <Box display="flex" flexWrap="wrap" gap={2} mb={1}>
            <Typography variant="caption" color="text.secondary">Trace: {log.traceId}</Typography>
            <Typography variant="caption" color="text.secondary">Span: {log.spanId}</Typography>
            <Typography variant="caption" color="text.secondary">Commit: {log.commit}</Typography>
          </Box>

          {/* Expanded Details */}
          {isExpanded && (
            <Box mt={2}>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Details</Typography>
                  <Typography variant="body2"><strong>Level:</strong> {log.level}</Typography>
                  <Typography variant="body2"><strong>Resource ID:</strong> {log.resourceId}</Typography>
                  <Typography variant="body2"><strong>Timestamp:</strong> {log.timestamp}</Typography>
                  <Typography variant="body2"><strong>Trace ID:</strong> {log.traceId}</Typography>
                  <Typography variant="body2"><strong>Span ID:</strong> {log.spanId}</Typography>
                  <Typography variant="body2"><strong>Commit:</strong> {log.commit}</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Metadata</Typography>
                  <Box
                    sx={{
                      backgroundColor: '#f4f4f4',
                      padding: 1.5,
                      borderRadius: 1,
                      whiteSpace: 'pre-wrap',
                      fontSize: 13,
                      fontFamily: 'monospace',
                      overflowX: 'auto',
                    }}
                  >
                    {JSON.stringify(log.metadata, null, 2)}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>

        {/* Expand/Collapse */}
        <IconButton onClick={toggleExpanded} size="small" sx={{ ml: 1 }}>
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
    </Paper>
  );
};

export default LogEntry;
