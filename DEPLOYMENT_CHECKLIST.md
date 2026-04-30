# Deployment Checklist

This project currently uses Astro SSR with the Netlify adapter (`@astrojs/netlify`).

## 1) Environment Variables

Set these in your hosting provider dashboard (do not rely only on local `.env`):

- `CRM_ADMIN_PASSWORD` - CMS login password
- `CRM_SESSION_SECRET` - long random secret for signed session cookie
- `EMAIL_HOST` - SMTP host (if contact/demo mail sending is enabled)
- `EMAIL_PORT` - SMTP port (usually `465` or `587`)
- `EMAIL_USER` - SMTP username
- `EMAIL_PASS` - SMTP password/app-password
- `EMAIL_FROM` - sender email identity (e.g. `noreply@trackora.tech`)

Optional (if used in your runtime/business flow):
- `NODE_ENV=production`
- Any analytics IDs (GTM/GA/etc.) if later integrated

## 2) Adapter / Platform Alignment

Current config in `astro.config.mjs`:
- `output: "server"`
- `adapter: netlify()`

If deploying to **Netlify**, keep as-is.

If deploying to **Vercel**, switch adapter first:
1. Install: `npm i @astrojs/vercel`
2. Update `astro.config.mjs` to use `vercel()` adapter
3. Remove Netlify-specific assumptions before production deploy

## 3) Pre-Deploy Quality Gates

Run locally before every deployment:

```bash
npm run lint
npm run build
```

Expected:
- `lint` -> `0 errors`
- `build` -> success

## 4) Vercel Smoke Tests (Post-Deploy)

After deployment completes, verify these URLs and actions on the live domain:

### Homepage
- Open `/`
- Click primary CTA buttons (Book Demo/contact-related CTAs) and confirm destination
- Confirm hero media and section images render correctly

### Contact flow
- Open `/contact`
- Submit contact form with test data
- Verify:
  - success feedback shown
  - lead appears in CMS leads table
  - email received (if SMTP configured)

### CMS auth and content
- Open `/crm-login`
- Login with `CRM_ADMIN_PASSWORD`
- Update:
  - social links
  - homepage section text
  - one blog post
- Save and verify public site reflects updates

### Blog and dynamic routes
- Open `/blog`
- Open 2-3 post detail pages (`/blog/[slug]`)
- Confirm no 404s and content renders correctly

### API and media
- Upload media in CMS where applicable
- Delete uploaded media
- Confirm API endpoints return expected success responses

## 5) Production Safety Checks

- Confirm cookies are set in production and CMS session persists as expected
- Confirm there are no secrets committed in git history (`.env` should stay local)
- Check host logs for:
  - 5xx errors on `/api/contact`, `/api/demo`, `/api/crm/*`
  - SSR function timeouts

## 6) Rollback Plan

If smoke tests fail:
1. Roll back to previous working deployment in host dashboard
2. Restore previous env var values if changed
3. Re-run local `lint` + `build` and fix before redeploy

