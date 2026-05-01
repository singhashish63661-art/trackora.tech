/**
 * Serverless hosts (e.g. Vercel) inject env at runtime on `process.env`.
 * `import.meta.env` for non-PUBLIC keys is often build-time only, so API routes
 * should read secrets here first.
 */
export function serverEnv(key: string): string {
  const fromProcess = process.env[key];
  if (fromProcess !== undefined && fromProcess !== "") {
    return fromProcess.trim();
  }
  const meta = (import.meta as ImportMeta & { env?: Record<string, string> })
    .env?.[key];
  return meta?.trim() ?? "";
}

export function getGmailConfig(): { user: string; pass: string } | null {
  const user = serverEnv("GMAIL_USER");
  const pass = serverEnv("GMAIL_PASS");
  if (!user || !pass) return null;
  return { user, pass };
}
