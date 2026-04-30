import type { APIRoute } from "astro";
import {
  getSessionCookieName,
  isValidSessionValue,
} from "../../../../lib/crm-auth";
import { saveSiteSettings, type SiteSettings } from "../../../../lib/site-settings";

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = cookies.get(getSessionCookieName())?.value;
  if (!isValidSessionValue(session)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await request.json()) as SiteSettings;
    await saveSiteSettings(body);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("CRM settings save failed:", error);
    return new Response(JSON.stringify({ message: "Unable to save settings" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};

