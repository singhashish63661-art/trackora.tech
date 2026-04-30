# Vercel Deployment Guide

This repo is currently configured for Netlify SSR.

To deploy on Vercel, switch Astro adapter and then run the smoke tests below.

## 1) Install Vercel Adapter

```bash
npm i @astrojs/vercel
```

## 2) Update Astro Config

Edit `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import icon from "astro-icon";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [tailwind(), react(), icon()],
  site: "https://trackora.tech",
});
```

Notes:
- Remove `@astrojs/netlify` import and adapter usage.
- Keep `output: "server"` for API routes and CMS auth/session flows.

## 3) Set Environment Variables in Vercel

Project Settings -> Environment Variables:

- `CRM_ADMIN_PASSWORD`
- `CRM_SESSION_SECRET`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`

Recommended:
- Set for **Production**, **Preview**, and **Development** environments.

## 4) Local Pre-Deploy Checks

```bash
npm run lint
npm run build
```

Both should pass before pushing/deploying.

## 5) Deploy on Vercel

### Option A: Git Integration
1. Push changes to your branch/main.
2. Import repo in Vercel.
3. Vercel auto-detects Astro.
4. Ensure env vars are set.
5. Deploy.

### Option B: CLI
```bash
npm i -g vercel
vercel
vercel --prod
```

## 6) Post-Deploy Smoke Tests

Use deployed URL and validate:

### Public Site
- `/` loads
- `/contact` form submit works
- `/blog` and `/blog/[slug]` pages render
- CTA buttons route correctly (`/contact` or intended target)

### CMS
- `/crm-login` login works with `CRM_ADMIN_PASSWORD`
- save social links
- save homepage settings
- blog create/update/delete works

### APIs
- `/api/contact` and `/api/demo` return success on valid submit
- `/api/crm/*` routes authenticate and persist data

## 7) Common Vercel Issues

- **401/500 in CMS login**: missing `CRM_SESSION_SECRET` or `CRM_ADMIN_PASSWORD`.
- **Contact/demo emails not sent**: SMTP vars missing or blocked provider.
- **Media upload issues**: verify runtime write assumptions and persistence strategy (ephemeral file system on serverless environments).
- **Wrong canonical/site metadata**: confirm `site` value in `astro.config.mjs`.

## 8) Rollback

In Vercel:
1. Open project -> Deployments
2. Select last healthy deployment
3. Promote/Redeploy that version

Then re-check env vars and recent config changes.

