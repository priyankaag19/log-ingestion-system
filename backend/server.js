const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const LOGS_FILE = path.join(__dirname, 'logs.json');

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Initialize logs file if it doesn't exist
const initializeLogsFile = () => {
  if (!fs.existsSync(LOGS_FILE)) {
    fs.writeFileSync(LOGS_FILE, JSON.stringify([], null, 2));
  }
};

// Read logs from file
const readLogs = () => {
  try {
    const data = fs.readFileSync(LOGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading logs file:', error);
    return [];
  }
};

// Write logs to file
const writeLogs = (logs) => {
  try {
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing logs file:', error);
    return false;
  }
};

// Log schema validation
const validateLogEntry = (log) => {
  const requiredFields = ['level', 'message', 'resourceId', 'timestamp', 'traceId', 'spanId', 'commit', 'metadata'];
  const validLevels = ['error', 'warn', 'info', 'debug'];

  // Check required fields
  for (const field of requiredFields) {
    if (!log.hasOwnProperty(field)) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }

  // Validate level
  if (!validLevels.includes(log.level)) {
    return { valid: false, error: `Invalid level. Must be one of: ${validLevels.join(', ')}` };
  }

  // Validate timestamp format (ISO 8601)
  const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  if (!timestampRegex.test(log.timestamp)) {
    return { valid: false, error: 'Invalid timestamp format. Must be ISO 8601 format.' };
  }

  // Validate metadata is an object
  if (typeof log.metadata !== 'object' || log.metadata === null || Array.isArray(log.metadata)) {
    return { valid: false, error: 'Metadata must be a valid JSON object' };
  }

  return { valid: true };
};

// Filter logs based on query parameters
const filterLogs = (logs, filters) => {
  return logs.filter(log => {
    // Level filter
    if (filters.level && log.level !== filters.level) {
      return false;
    }

    // Message search (case-insensitive)
    if (filters.message && !log.message.toLowerCase().includes(filters.message.toLowerCase())) {
      return false;
    }

    // Resource ID filter
    if (filters.resourceId && log.resourceId !== filters.resourceId) {
      return false;
    }

    // Timestamp range filter
    if (filters.timestamp_start) {
      const logTime = new Date(log.timestamp);
      const startTime = new Date(filters.timestamp_start);
      if (logTime < startTime) {
        return false;
      }
    }

    if (filters.timestamp_end) {
      const logTime = new Date(log.timestamp);
      const endTime = new Date(filters.timestamp_end);
      if (logTime > endTime) {
        return false;
      }
    }

    // Trace ID filter
    if (filters.traceId && log.traceId !== filters.traceId) {
      return false;
    }

    // Span ID filter
    if (filters.spanId && log.spanId !== filters.spanId) {
      return false;
    }

    // Commit filter
    if (filters.commit && log.commit !== filters.commit) {
      return false;
    }

    return true;
  });
};

// Routes

// POST /logs - Ingest a single log entry
app.post('/logs', (req, res) => {
  try {
    const logEntry = req.body;

    // Validate log entry
    const validation = validateLogEntry(logEntry);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Invalid log entry',
        message: validation.error
      });
    }

    // Read current logs
    const logs = readLogs();

    // Add new log entry
    logs.push(logEntry);

    // Write updated logs
    const success = writeLogs(logs);
    if (!success) {
      return res.status(500).json({
        error: 'Failed to save log entry',
        message: 'Internal server error during persistence'
      });
    }

    // Return created log entry
    res.status(201).json(logEntry);
  } catch (error) {
    console.error('Error in POST /logs:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    });
  }
});

// GET /logs - Retrieve and filter log entries
app.get('/logs', (req, res) => {
  try {
    const logs = readLogs();

    // Extract query parameters
    const filters = {
      level: req.query.level,
      message: req.query.message,
      resourceId: req.query.resourceId,
      timestamp_start: req.query.timestamp_start,
      timestamp_end: req.query.timestamp_end,
      traceId: req.query.traceId,
      spanId: req.query.spanId,
      commit: req.query.commit
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    // Apply filters
    const filteredLogs = filterLogs(logs, filters);

    // Sort by timestamp (most recent first)
    filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json(filteredLogs);
  } catch (error) {
    console.error('Error in GET /logs:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while retrieving logs'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// Initialize and start server
initializeLogsFile();

app.listen(PORT, () => {
  console.log(`Log Ingestion Server running on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  POST http://localhost:${PORT}/logs - Ingest log entry`);
  console.log(`  GET  http://localhost:${PORT}/logs - Query log entries`);
  console.log(`  GET  http://localhost:${PORT}/health - Health check`);
});

module.exports = app;