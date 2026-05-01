/** Production URL for the current path (no query string). */
export function getCanonicalUrl(site: URL | undefined, pathname: string): string {
  const base = site ?? new URL("https://trackora.tech");
  const path = pathname && pathname !== "" ? pathname : "/";
  return new URL(path, base).href;
}

/** Resolve relative site paths to absolute URLs for Open Graph / JSON-LD. */
export function toAbsoluteUrl(site: URL | undefined, pathOrUrl: string): string {
  const s = pathOrUrl.trim();
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  const base = site ?? new URL("https://trackora.tech");
  const path = s.startsWith("/") ? s : `/${s}`;
  return new URL(path, base).href;
}

/** Safe embedding of JSON-LD in HTML (prevents `</script>` breakage). */
export function jsonLdStringify(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Best-effort ISO-8601 from marketing-style dates (e.g. "JUL 20, 2025"). */
export function tryParseArticleIso(displayDate: string): string | undefined {
  const raw = displayDate.trim();
  const tryParse = (value: string) => {
    const t = Date.parse(value);
    return Number.isNaN(t) ? undefined : new Date(t).toISOString();
  };

  let iso = tryParse(raw);
  if (iso) return iso;
  iso = tryParse(raw.replace(/,/g, ""));
  if (iso) return iso;

  const normalized = raw.replace(
    /^([A-Z]{3})\s+(\d{1,2}),\s*(\d{4})$/i,
    (_, mon: string, day: string, year: string) => {
      const map: Record<string, string> = {
        JAN: "Jan",
        FEB: "Feb",
        MAR: "Mar",
        APR: "Apr",
        MAY: "May",
        JUN: "Jun",
        JUL: "Jul",
        AUG: "Aug",
        SEP: "Sep",
        OCT: "Oct",
        NOV: "Nov",
        DEC: "Dec",
      };
      const m = map[mon.toUpperCase()];
      return m ? `${m} ${day}, ${year}` : raw;
    },
  );
  return tryParse(normalized);
}
