import type { APIRoute } from "astro";
import {
  getSessionCookieName,
  isValidSessionValue,
} from "../../../../../lib/crm-auth";
import { saveHomeSettings, type HomeSettings } from "../../../../../lib/home-settings";

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = cookies.get(getSessionCookieName())?.value;
  if (!isValidSessionValue(session)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await request.json()) as HomeSettings;
    await saveHomeSettings(body);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Home settings save failed:", error);
    const message =
      error instanceof Error ? error.message : "Unable to save home settings";
    return new Response(JSON.stringify({ message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};

