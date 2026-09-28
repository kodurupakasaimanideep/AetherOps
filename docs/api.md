# OpsMind API Documentation

## Base URL
`http://localhost:8000/api/v1`

## Endpoints

### 1. Health Check
- `GET /health`
- Response: `{"status": "ok", "service": "OpsMind API"}`

### 2. Incidents
- `GET /incidents` - List all incidents
- `GET /incidents/{id}` - Get incident details
- `POST /incidents` - Create new incident
- `PATCH /incidents/{id}` - Update incident status

### 3. Agent Investigation
- `POST /agent/investigate/{incident_id}` - Trigger AI Agent investigation
- `POST /agent/chat` - Interactive agent copilot chat

### 4. Memory
- `GET /memory` - Retrieve all indexed operational memories
- `POST /memory/search` - Perform Hindsight similarity search
