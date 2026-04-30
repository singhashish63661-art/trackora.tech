# Trackora

Official website project for Trackora.

## Requirements

- Node.js 18+ (LTS recommended)
- npm 9+

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.example .env
```

3. Update `.env` values with your credentials:

- `GMAIL_USER`
- `GMAIL_PASS`
- `CRM_ADMIN_PASSWORD`
- `CRM_SESSION_SECRET` (optional, recommended)

These are used by API routes that send emails from forms.

`CRM_ADMIN_PASSWORD` is required to login at `/crm-login`.  
`CRM_SESSION_SECRET` signs CRM session cookies; if not provided, a fallback based on password is used.

## Run Locally

Start development server:

```bash
npm run dev
```

Open the URL shown in terminal (usually `http://localhost:4321`).

## Build and Preview Production

```bash
npm run build
npm run preview
```

## Scripts

- `npm run dev`: Start local development server
- `npm run start`: Alias for `npm run dev`
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run astro`: Run Astro CLI commands

## Project Structure

```text
/
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   ├── pages/
│   └── styles/
└── package.json
```

## Verify Forms Locally

Use this checklist after starting the dev server with `npm run dev`.

1. Open the contact page in your browser.
2. Fill in the form fields and submit.
3. Confirm you receive a success response in the UI (or no error state).
4. Check terminal logs for any API errors from `src/pages/api/contact.ts`.

You can also test the API endpoint directly:

```bash
curl -X POST http://localhost:4321/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Hello from local test"}'
```

For career submissions, repeat the same flow for the career form and monitor logs from `src/pages/api/career.ts`.

## Troubleshooting

- If email form submissions fail, verify `GMAIL_USER` and `GMAIL_PASS` in `.env`.
- If dependency install fails, remove `node_modules` and reinstall with `npm install`.
