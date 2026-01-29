# Faces Agency Backend API

Simple Express backend for handling HubSpot contact submissions.

## Quick Deploy to Railway

1. Push this folder to GitHub
2. Go to [Railway.app](https://railway.app)
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select this repository
5. Add environment variable: `HUBSPOT_ACCESS_TOKEN`
6. Deploy!

Railway will automatically:
- Detect Node.js project
- Install dependencies (`npm install`)
- Run `npm start`
- Give you a public URL

## Alternative: Deploy to Render

1. Go to [Render.com](https://render.com)
2. Click **"New+"** → **"Web Service"**
3. Connect your GitHub repository
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variable: `HUBSPOT_ACCESS_TOKEN`
6. Deploy!

## Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Add your HUBSPOT_ACCESS_TOKEN to .env

# Start server
npm start
```

Server will run on `http://localhost:3001`

## API Endpoints

### GET /
Health check endpoint
```
GET http://localhost:3001/
Response: {"status":"ok","message":"Faces Agency API Server"}
```

### POST /api/hubspot
Create or update HubSpot contact

```bash
curl -X POST http://localhost:3001/api/hubspot \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "mobile": "+961 70123456"
  }'
```

Response:
```json
{
  "success": true,
  "action": "created",
  "contactId": "12345"
}
```

## Environment Variables

- `HUBSPOT_ACCESS_TOKEN` - Your HubSpot private app access token
- `PORT` - Server port (default: 3001)

## Frontend Integration

Update your frontend `.env` to point to the deployed backend:

```env
VITE_API_URL=https://your-backend.railway.app
```

Then in `submitApplication.ts`:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const response = await fetch(`${API_URL}/api/hubspot`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```
