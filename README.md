# DECIDE Web App

Frontend-only MVP web app for DECIDE.

## What is included

- Landing screen
- Signup and login UI
- Supabase Auth-ready frontend
- Main decision workspace
- Loading state
- Mock result screen
- History screen
- Profile screen
- Mobile-first responsive design
- PWA manifest and service worker
- Vercel-ready static deployment

## Supabase

Open `supabase-config.js` and add the public project values:

```js
window.DECIDE_SUPABASE = {
  url: 'https://YOUR_PROJECT.supabase.co',
  anonKey: 'YOUR_PUBLIC_ANON_KEY'
};
```

Do not put the `service_role` key in the frontend.

## Deploy

Upload this folder to Vercel or GitHub Pages. The app is static and does not need a build step.
