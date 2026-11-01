# Paras Wane — portfolio

Single-page portfolio with a procedural three.js ball bearing. See the PRD, UI Guidelines and User Flows docs in this folder.

## Run

```bash
npm install
cp .env.example .env   # fill in VITE_FORMSPREE_ID, VITE_WHATSAPP_NUMBER, VITE_SITE_URL
npm run dev
npm run build && npm run preview
```

## Where things live

- `src/content/` — all copy and data (`projects.ts`, `profile.ts`, `journey.ts`). Add a project by adding one object.
- `src/sections/`, `src/routes/` — home sections, `/work/:slug`, 404.
- `src/scene/` — `SceneLayer` (tier + poster, always loaded) and the lazily loaded three.js chunk (`Scene`, `Bearing`, `poses`).
- `src/lib/capability.ts` — High / Mid / Poster tier selection.

## Still to do before launch

- Set `VITE_SITE_URL` in Vercel to the real domain (canonical, sitemap and JSON-LD use it), and `VITE_FORMSPREE_ID` for the contact form.
- Point `siteRepo` in `src/content/profile.ts` at this site's repo once it is pushed.
- Gym demo logins in `DemoPanel.tsx` are dummy accounts; keep the data behind them demo-only.
- Pre-rendered posters from the live scene to replace the SVG `Poster`.
- Pre-rendering for SEO (`vite-ssg` or similar), Bloom on High tier, Hindi/Marathi Services toggle (P2).
