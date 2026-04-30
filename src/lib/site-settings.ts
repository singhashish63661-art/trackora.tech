import { promises as fs } from "node:fs";
import path from "node:path";

export interface SocialLinks {
  linkedin?: string;
  instagram?: string;
  youtube?: string;
}

export interface SiteSettings {
  social?: SocialLinks;
}

const SETTINGS_DIR = path.join(process.cwd(), ".cms");
const SETTINGS_FILE = path.join(SETTINGS_DIR, "site-settings.json");

function normalizeUrl(url: string) {
  const v = (url || "").trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  if (v.startsWith("//")) return `https:${v}`;
  return `https://${v}`;
}

async function ensureSettingsFile() {
  await fs.mkdir(SETTINGS_DIR, { recursive: true });
  try {
    await fs.access(SETTINGS_FILE);
  } catch {
    const initial: SiteSettings = { social: {} };
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(initial, null, 2), "utf-8");
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  await ensureSettingsFile();
  const raw = await fs.readFile(SETTINGS_FILE, "utf-8");
  const parsed = JSON.parse(raw) as SiteSettings;
  const social = parsed?.social ?? {};
  return {
    social: {
      linkedin: social.linkedin ? normalizeUrl(social.linkedin) : undefined,
      instagram: social.instagram ? normalizeUrl(social.instagram) : undefined,
      youtube: social.youtube ? normalizeUrl(social.youtube) : undefined,
    },
  };
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  await ensureSettingsFile();
  const toSave: SiteSettings = {
    social: {
      linkedin: settings.social?.linkedin ? normalizeUrl(settings.social.linkedin) : undefined,
      instagram: settings.social?.instagram ? normalizeUrl(settings.social.instagram) : undefined,
      youtube: settings.social?.youtube ? normalizeUrl(settings.social.youtube) : undefined,
    },
  };
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(toSave, null, 2), "utf-8");
}

