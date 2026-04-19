# EduAI Mobile (Expo · React Native)

Cross-platform iOS + Android app for EduAI — courses, live AI Playground, and full-screen Reels with HLS support.

## Stack

- Expo (React Native)
- React Navigation (bottom tabs)
- `react-native-youtube-iframe` + `hls.js`/WebView playback path for reels
- Local CMS API (`cms-server`) for your own reel metadata/HLS URLs
- Live AI via existing backend at `https://aipramgram.vercel.app/api/chat`

## 1) Install

```bash
npm install
```

## 2) Environment

Create `.env` from `.env.example`:

```bash
copy .env.example .env
```

Key values:

- `EXPO_PUBLIC_CMS_BASE_URL=http://localhost:4100`
- `CMS_PORT=4100`
- `CMS_ADMIN_TOKEN=eduai-local-admin`

## 3) Run CMS (Terminal 1)

```bash
npm run cms
```

- API health: `http://localhost:4100/api/health`
- Reels API: `http://localhost:4100/api/reels`
- CMS UI: `http://localhost:4100/cms`

## 4) Run App Preview (Terminal 2)

```bash
npm run web
```

Open: `http://localhost:8082`

## Reels HLS Flow

- App fetches reels from CMS via `src/context/AppContext.js`.
- If reel has `hlsUrl`, Reels uses `HlsVideoPlayer`.
- If no `hlsUrl`, it falls back to YouTube (`youtubeId`).

## CMS API (local)

- `GET /api/reels` public
- `POST /api/reels` admin (header `x-admin-token`)
- `PUT /api/reels/:id` admin
- `DELETE /api/reels/:id` admin
