/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_WEB3FORMS_ACCESS_KEY?: string;
  /** Google Search Console HTML tag verification value */
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
  /** Gmail SMTP (server-side; also set in Vercel as plain env) */
  readonly GMAIL_USER?: string;
  readonly GMAIL_PASS?: string;
  readonly CRM_ADMIN_PASSWORD?: string;
  readonly CRM_SESSION_SECRET?: string;
}
