# EduAI Mobile - Deployment Guide

## Quick Local Start

Double-click `start-all.bat` to start both services:
- CMS API: http://localhost:4100
- CMS UI: http://localhost:4100/cms  
- App Preview: http://localhost:8082

## Render Deployment

### 1. Deploy CMS Backend

1. Push code to GitHub
2. Connect Render to your repo
3. Render will auto-detect `render.yaml` and create both services

Or manual setup:
- **Service Type**: Web Service
- **Runtime**: Node
- **Build Command**: `npm ci`
- **Start Command**: `node cms-server/server.js`
- **Environment Variables**:
  - `CMS_ADMIN_TOKEN`: (generate a secure token)

### 2. Deploy Frontend

- **Service Type**: Static Site
- **Build Command**: `npm ci && npm run export:web`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `EXPO_PUBLIC_CMS_BASE_URL`: (your CMS service URL from step 1)

Important: do not create the frontend as a Node Web Service with `yarn start` or `node src/index.js`.
It must be a Static Site service so Render serves the exported `dist` folder.

### 3. HLS Streaming on Render

For HLS streaming, you need an external stream source. Options:
- **Cloudflare Stream**: Upload video, get HLS URL
- **Mux**: Create live stream, get HLS URL
- **AWS MediaLive**: For live streaming
- **Local OBS + ngrok**: For testing (stream to local, expose via ngrok)

Add the HLS URL to your reel via the CMS UI.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  React Native   │────▶│   CMS API        │────▶│  HLS Streams    │
│  (Expo Web)     │     │  (Node/Express)  │     │  (External)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │
        ▼                        ▼
   Reels Data              Reels JSON File
   (Fetched via             (Managed via
    fetch())                CMS UI/API)
```

## Files for Deployment

- `render.yaml` - Render Blueprint config
- `cms-server/server.js` - CMS API server
- `cms-server/data/reels.json` - Reels data file
- `cms-server/public/index.html` - CMS Admin UI
- `src/context/AppContext.js` - Fetches reels from CMS
- `src/constants/data.js` - CMS_BASE URL config

## Troubleshooting

1. **Port 4100 in use**: Run `taskkill /F /IM node.exe` then restart
2. **CMS not responding**: Check if `cms-server/data/reels.json` exists
3. **App not loading reels**: Check browser console for fetch errors
4. **HLS not playing**: Verify HLS URL is valid (test in VLC or another player)

## Environment Variables

Create `.env` file:
```
# Local development
EXPO_PUBLIC_CMS_BASE_URL=http://localhost:4100
CMS_PORT=4100
CMS_ADMIN_TOKEN=your-secure-token

# Production (Render)
# EXPO_PUBLIC_CMS_BASE_URL=https://eduai-cms-api.onrender.com
```
