# Deployment Guide

## Recommended simple deployment

- Frontend: Vercel, Netlify, or Firebase Hosting
- Backend: Render, Railway, Google Cloud Run, or Fly.io
- Secrets: backend environment variables

## Backend environment variables

```env
GOOGLE_API_KEY=your_google_key
GEMINI_MODEL=gemini-1.5-flash
MCP_SERVER_URL=https://your-mcp-bridge.example.com/mcp
MCP_AUTH_TOKEN=optional_token
```

## Frontend API URL

Create `frontend/.env` locally or set this in your hosting provider:

```env
VITE_API_URL=https://your-backend.example.com/api/agent/run
```

## Google Cloud Run backend outline

1. Create a backend Dockerfile or use a Python buildpack.
2. Deploy the `backend` folder.
3. Set the environment variables above.
4. Allow CORS from your hosted frontend domain in `backend/app/main.py`.

## Vercel/Netlify frontend outline

1. Set project root to `frontend`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set `VITE_API_URL` to your hosted backend endpoint.

## Final smoke checks

- Open `/health` on the backend.
- Run the frontend and click **Run agent**.
- Confirm the UI shows `Gemini: connected` after adding the key.
- Confirm the UI shows `MCP: connected` after adding the MCP bridge URL.
