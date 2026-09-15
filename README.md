# Karibu Match

Location-based dating demo for Kenya. People nearby first — Nairobi, Mombasa, Kisumu, Kiambu and other counties.

Live idea: profiles, county filters, likes, matches, chat UI, report-minded copy. Data stays in the browser (`localStorage`). This is a frontend you can host on **Netlify** from **GitHub**.

## What is included

- Landing page with Kenyan county framing
- Email/password demo auth (client-side only)
- Discover deck sorted by mock distance
- Likes, matches, chat pane
- Profile editor (name, age, county, bio, interests)

## What a production build still needs

| Feature | Suggested stack |
|---|---|
| Real accounts | Auth.js / Clerk / Firebase Auth |
| GPS + nearby query | Browser Geolocation + PostGIS or MongoDB geo indexes |
| Photos | Cloudinary or S3 + signed uploads |
| Realtime chat | Socket.io or Supabase Realtime |
| Push notifications | Web push / FCM |
| Reports & moderation | Admin queue + block lists |
| M-Pesa | Daraja API on a Node/Django backend |

Netlify is ideal for the static UI and serverless functions. Persistent chat, matching, and payments should live on a backend (or Supabase).

## Local

Open `index.html` or serve the folder:

```bash
npx serve .
```

## GitHub + Netlify

1. Repo: https://github.com/gachiesamuel14/karibu-match
2. Netlify → Add new site → Import from GitHub → this repo
3. Build command: leave empty (static)
4. Publish directory: `/`

## Safety

Meet in public. Never send M-Pesa PINs or deposits to strangers. Report and block exist for a reason.
