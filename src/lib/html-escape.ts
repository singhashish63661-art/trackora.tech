/** Escape text for HTML text nodes and double-quoted attribute values. */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Only allow http(s) URLs or same-origin-style paths (leading `/`, not `//`).
 * Returns empty string if unsafe.
 */
export function sanitizeUrlForImg(raw: string): string {
  const s = raw.trim();
  if (!s) return "";
  if (s.startsWith("/") && !s.startsWith("//")) return s;
  try {
    const u = new URL(s);
    if (u.protocol === "https:" || u.protocol === "http:") return u.href;
  } catch {
    /* invalid URL */
  }
  return "";
}

/** Single path segment for `/blog/:slug` — blocks quotes, spaces, traversal. */
export function sanitizeSlugForPath(raw: string): string {
  const s = String(raw ?? "").trim();
  if (!s || s.length > 200) return "";
  if (/[<>"'`\\\s]/.test(s)) return "";
  if (s.includes("..") || s.includes("/")) return "";
  return s;
}
