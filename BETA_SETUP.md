# EduAI Beta Setup Guide

## Architecture

```
[Expo Web / Mobile]
      │
      ├── Auth & Database ──── Supabase (free tier)
      ├── Reels CMS  ──────── Render (cms-server)
      ├── AI Chat  ────────── aipramgram.vercel.app (OpenRouter proxy)
      └── Frontend ────────── Vercel (eduai-mobile.vercel.app)
```

---

## Step 1 — Create Supabase Project (5 min)

1. Go to **https://supabase.com** → New project
2. Name it `eduai`, choose a region close to your users, set a DB password
3. Wait ~2 min for the project to provision
4. Go to **Settings → API** → copy:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

## Step 2 — Run the Database Schema

1. In your Supabase dashboard → **SQL Editor** → **New Query**
2. Paste the contents of `supabase/schema.sql`
3. Click **Run** — you should see "Success" with no errors

This creates:
- `profiles` — user display name + coins
- `enrollments` — which courses each user enrolled in
- `liked_reels` — liked reel IDs per user
- `saved_reels` — saved reel IDs per user
- Row Level Security policies (users only see their own data)
- A trigger that auto-creates a profile row on signup

---

## Step 3 — Set Environment Variables

### For local dev
Copy `.env.example` to `.env.local` and fill in your values:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
EXPO_PUBLIC_CMS_BASE_URL=http://localhost:4100
```

### For Vercel (production)
1. Go to **Vercel dashboard → eduai-mobile project → Settings → Environment Variables**
2. Add:
   - `EXPO_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
   - `EXPO_PUBLIC_CMS_BASE_URL` = your Render CMS URL (or leave blank to use static reels)

---

## Step 4 — Deploy the CMS Backend to Render

1. Go to **https://render.com** → New → Web Service
2. Connect your GitHub repo (`Wingmahsword/eduaimobile`)
3. Set:
   - **Root Directory**: `cms-server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: Node
4. Add env var: `CMS_ADMIN_TOKEN` = a secret string (save it)
5. Deploy → copy the URL (e.g. `https://eduai-cms-api.onrender.com`)
6. Add that URL as `EXPO_PUBLIC_CMS_BASE_URL` in Vercel

---

## Step 5 — Rebuild and Redeploy Frontend

```bash
# From eduai-mobile root:
npx expo export --platform web --clear
# (index.html is auto-updated by the build script)
git add .
git commit -m "feat: add auth + supabase integration"
git push
# Vercel auto-deploys on push, OR run:
npx vercel --prod --yes
```

---

## Step 6 — Share with Beta Testers

Send them: **https://eduai-mobile.vercel.app**

Beta testers will:
1. See the login screen on first visit
2. Create an account with email + password
3. Their enrollments, likes, and coins persist across sessions and devices

---

## Supabase Auth Settings (recommended for beta)

In Supabase Dashboard → **Authentication → Settings**:
- ✅ Enable email confirmations → **OFF** for beta (so testers don't need to verify email)
- Set **Site URL** to `https://eduai-mobile.vercel.app`
- Add to **Redirect URLs**: `https://eduai-mobile.vercel.app`

---

## Admin: View Beta User Data

In Supabase Dashboard:
- **Authentication → Users** — see all registered beta testers
- **Table Editor → profiles** — see coins per user
- **Table Editor → enrollments** — see what each user enrolled in

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Invalid API key" on login | Check EXPO_PUBLIC_SUPABASE_ANON_KEY is set in Vercel |
| Login works but data doesn't save | Run `supabase/schema.sql` in Supabase SQL editor |
| Auth screen not showing | Clear browser cache / localStorage |
| CMS reels not loading | App falls back to static reels — deploy cms-server to Render |
