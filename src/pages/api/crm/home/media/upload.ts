import type { APIRoute } from "astro";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  getSessionCookieName,
  isValidSessionValue,
} from "../../../../../lib/crm-auth";

const PUBLIC_ASSETS_DIR = path.join(process.cwd(), "public", "assets");

type MediaKind = "heroVideo" | "dashboardVideo";

function sanitizeKind(kind: string): MediaKind | null {
  if (kind === "heroVideo") return "heroVideo";
  if (kind === "dashboardVideo") return "dashboardVideo";
  return null;
}

function guessExt(file: File) {
  const nameExt = path.extname(file.name || "");
  if (nameExt) return nameExt;

  if (file.type === "video/mp4") return ".mp4";
  if (file.type === "image/png") return ".png";
  if (file.type === "image/jpeg") return ".jpg";
  if (file.type === "image/webp") return ".webp";

  return ".bin";
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
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const kind = String(formData.get("kind") || "");
    const safeKind = sanitizeKind(kind);

    if (!file || !safeKind || file.size <= 0) {
      return new Response(JSON.stringify({ message: "Invalid upload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const uploadDir = path.join(PUBLIC_ASSETS_DIR, "home-media", safeKind);
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = guessExt(file);
    const safeName = `${safeKind}-${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
    const filePath = path.join(uploadDir, safeName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    const url = `/assets/home-media/${safeKind}/${safeName}`;
    return new Response(JSON.stringify({ ok: true, url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Home media upload failed:", error);
    return new Response(JSON.stringify({ message: "Unable to upload media" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

