import type { APIRoute } from "astro";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  getSessionCookieName,
  isValidSessionValue,
} from "../../../../../lib/crm-auth";

const PUBLIC_ASSETS_DIR = path.join(process.cwd(), "public", "assets");

function resolveAssetPath(url: string) {
  // Expect /assets/home-media/<kind>/<filename>
  if (!url.startsWith("/assets/")) return null;
  const relative = url.replace(/^\/assets\//, "");
  return path.join(PUBLIC_ASSETS_DIR, relative);
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = cookies.get(getSessionCookieName())?.value;
  if (!isValidSessionValue(session)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await request.json()) as { url?: string };
    const url = String(body.url || "");
    const filePath = resolveAssetPath(url);
    if (!url || !filePath) {
      return new Response(JSON.stringify({ message: "Invalid url" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      await fs.unlink(filePath);
    } catch {
      // Best-effort.
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Home media delete failed:", error);
    return new Response(JSON.stringify({ message: "Unable to delete media" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};

