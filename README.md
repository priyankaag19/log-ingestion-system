🚀 Log Ingestion and Querying System
A full-stack application for ingesting, storing, and querying structured log data. Built with Node.js, Express, React, MUI, and JSON file-based persistence, this system offers a real-time, responsive interface inspired by industry-grade logs.

✨ Features
🔧 Backend (Node.js + Express)
✅ RESTful API for log ingestion and retrieval

✅ POST /logs endpoint to ingest logs

✅ GET /logs endpoint with powerful filtering

✅ Timestamp range filtering (from and to)

✅ Level filter, resource ID, trace ID, span ID, and commit hash filters

✅ Schema validation of incoming logs

✅ Error handling with clear messages

✅ CORS support

✅ Health check endpoint

✅ JSON file storage (no external DB)

✅ Atomic writes and in-memory filtering

🖥️ Frontend (React + MUI)
✅ Responsive, modern UI using Material UI (MUI)

✅ Real-time search with debounced input

✅ Level dropdown with color-coded indicators (Error, Warn, Info, Debug)

✅ Expandable log entries showing full metadata

✅ Filtering by date, resource ID, trace ID, span ID, and commit

✅ Reverse chronological sorting

✅ Graceful error and loading states

📋 Requirements
Node.js v14.0.0+

npm v6.0.0+

Modern browser (Chrome, Firefox, Edge, Safari)

🛠️ Installation & Setup
1. Clone the Repository
bash
Copy
Edit
git clone <repository-url>
cd log-ingestion-system
2. Setup the Backend
bash
Copy
Edit
cd backend
npm install
node server.js
Backend runs at: http://localhost:3001

3. Setup the Frontend
In a new terminal:

bash
Copy
Edit
cd frontend
npm install
npm run dev
Frontend runs at: http://localhost:5173

📁 Project Structure
perl
Copy
Edit
log-ingestion-system/
├── backend/
│   ├── server.js              # Express backend with log routes
│   ├── package.json           # Backend dependencies
│   └── logs.json              # Log storage file (acts as DB)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FilterBar.jsx     # UI controls for filtering logs
│   │   │   ├── LogList.jsx       # Displays list of logs
│   │   │   └── LogEntry.jsx      # Individual log card
│   │   ├── services/
│   │   │   └── api.js            # Axios-based API functions
│   │   ├── App.jsx               # Main frontend app
│   ├── package.json              # Frontend dependencies
└── README.md
🔌 API Endpoints
POST /logs
Add a new log entry.

Request Body:

json
Copy
Edit
{
  "level": "error",
  "message": "Failed to connect to database",
  "resourceId": "server-1234",
  "timestamp": "2023-09-15T08:00:00Z",
  "traceId": "abc-xyz-123",
  "spanId": "span-456",
  "commit": "5e5342f",
  "metadata": {
    "parentResourceId": "server-5678"
  }
}
Response: 201 Created with the saved log entry.

GET /logs
Retrieve logs with optional filters.

Query Parameters:

level – error, warn, info, debug

message – partial/full message text

resourceId – match exact resource ID

traceId, spanId, commit

timestamp_start, timestamp_end – ISO date range

Example:

bash
Copy
Edit
GET /logs?level=error&resourceId=server-1234&timestamp_start=2023-09-01T00:00:00Z
🎨 UI Design Highlights
MUI-based layout with grid responsiveness

Color-coded log levels:

🟥 Error

🟨 Warning

🟦 Info

⚪ Debug

Expandable metadata sections for deeper visibility

Native datetime pickers for intuitive range selection

Debounced search input avoids unnecessary API calls

⚙️ Performance Optimizations
300ms debounce on message search

In-memory array filtering for speed

Efficient React state management

Only one .json read per request cycle

🔒 Security Considerations
✅ Input validation at backend

✅ CORS setup to limit frontend access

✅ Helmet (optional): for secure headers

✅ Proper React rendering avoids XSS

✅ How to Test
Start both frontend (npm start) and backend (npm start)

Use the UI to:

Type search queries (debounced)

Apply date, level, or ID filters

Submit malformed requests to test backend error handling

Verify:

Log entries show properly

Expand/collapse works

Error states are handled gracefully

