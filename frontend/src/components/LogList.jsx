import React from 'react';
import LogEntry from './LogEntry';
import {
  Paper,
  Typography,
  Box,
  Divider,
  Stack
} from '@mui/material';

const LogList = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h6" color="text.primary" gutterBottom>
          No logs found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your filters or refresh the page to load logs.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      <Paper elevation={3}>
        <Box sx={{ px: 3, py: 2, bgcolor: 'grey.100', borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle1" fontWeight={500}>
            Log Entries ({logs.length})
          </Typography>
        </Box>

        <Divider />

        {logs.map((log, index) => (
          <Box key={`${log.timestamp}-${index}`}>
            <LogEntry log={log} />
            {index !== logs.length - 1 && <Divider />}
          </Box>
        ))}
      </Paper>
    </Stack>
  );
};

export default LogList;
