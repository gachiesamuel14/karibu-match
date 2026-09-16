# Karibu Match

Location-based dating demo for Kenya. Nearby first — Nairobi, Mombasa, Kisumu, Kiambu and other counties.

Live site: https://karibu-match.netlify.app  
Repo: https://github.com/gachiesamuel14/karibu-match

## Included in this demo

- Landing page with Kenyan county framing
- Email/password demo auth (browser only)
- Discover deck with photos, county + Student / Professional / Church filters
- GPS permission on profile (stored locally)
- Likes, matches, chat pane
- Report flow
- Profile editor

Data stays in `localStorage`. This is not a production dating service.

## Production roadmap

| Feature | Suggested stack |
|---|---|
| Real accounts | Auth.js / Clerk / Firebase Auth |
| GPS + nearby query | Geolocation + PostGIS or MongoDB geo |
| Photos | Cloudinary or S3 |
| Realtime chat | Socket.io or Supabase Realtime |
| Push notifications | Web push / FCM |
| Reports & moderation | Admin queue + block lists |
| M-Pesa | Daraja API on Node or Django |

## Local

```bash
npx serve .
```

## GitHub + Netlify

1. This repo
2. Netlify → Import from GitHub
3. Build command: empty (static)
4. Publish directory: `/`
