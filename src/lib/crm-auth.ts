import { createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const COOKIE_NAME = "crm_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

function readFromDotEnv(key: string) {
  const currentFilePath = fileURLToPath(import.meta.url);
  const moduleRoot = path.resolve(path.dirname(currentFilePath), "../../");
  const candidatePaths = [
    path.join(process.cwd(), ".env"),
    path.join(moduleRoot, ".env"),
  ];

  for (const envPath of candidatePaths) {
    try {
      const content = readFileSync(envPath, "utf-8");
      const matcher = new RegExp(`(^|\\n)\\s*${key}\\s*=\\s*([^\\n\\r#]+)`, "m");
      const match = content.match(matcher);
      if (!match?.[2]) continue;
      return match[2].trim().replace(/^['"]|['"]$/g, "");
    } catch {
      // Continue through fallback paths.
    }
  }

  try {
    const fallbackContent = readFileSync(".env", "utf-8");
    const fallbackMatcher = new RegExp(`(^|\\n)\\s*${key}\\s*=\\s*([^\\n\\r#]+)`, "m");
    const fallbackMatch = fallbackContent.match(fallbackMatcher);
    if (!fallbackMatch?.[2]) return "";
    return fallbackMatch[2].trim().replace(/^['"]|['"]$/g, "");
  } catch {
    return "";
  }
}

function getEnvValue(key: "CRM_ADMIN_PASSWORD" | "CRM_SESSION_SECRET") {
  const fromImportMeta = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.[key] ?? "";
  const fromProcess = process.env[key] ?? "";
  const fromDotEnv = readFromDotEnv(key);
  return (fromImportMeta || fromProcess || fromDotEnv).trim();
}

function getAdminPassword() {
  return getEnvValue("CRM_ADMIN_PASSWORD");
}

function getSigningSecret() {
  const explicitSecret = getEnvValue("CRM_SESSION_SECRET");
  if (explicitSecret) return explicitSecret;
  return `trackora-crm:${getAdminPassword()}`;
}

function signPayload(payload: string) {
  return createHmac("sha256", getSigningSecret()).update(payload).digest("hex");
}

function toBase64(value: string) {
  return Buffer.from(value, "utf-8").toString("base64url");
}

function fromBase64(value: string) {
  return Buffer.from(value, "base64url").toString("utf-8");
}

export function isAuthConfigured() {
  return getAdminPassword().length > 0;
}

function safeEqualText(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}

export function isValidAdminPassword(password: string) {
  const configured = getAdminPassword();
  if (!configured) return false;
  return safeEqualText(password, configured);
}

export function createSessionCookieValue() {
  const payload = `${Date.now()}`;
  const encodedPayload = toBase64(payload);
  const signature = signPayload(payload);
  return `${encodedPayload}.${signature}`;
}

export function isValidSessionValue(cookieValue?: string | null) {
  if (!cookieValue) return false;
  const [encodedPayload, signature] = cookieValue.split(".");
  if (!encodedPayload || !signature) return false;

  let payload = "";
  try {
    payload = fromBase64(encodedPayload);
  } catch {
    return false;
  }

  const expectedSignature = signPayload(payload);
  if (!safeEqualText(signature, expectedSignature)) {
    return false;
  }

  const issuedAt = Number(payload);
  if (!Number.isFinite(issuedAt)) return false;
  const maxAgeMs = SESSION_MAX_AGE_SECONDS * 1000;
  return Date.now() - issuedAt < maxAgeMs;
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}

export function getSessionMaxAgeSeconds() {
  return SESSION_MAX_AGE_SECONDS;
}
