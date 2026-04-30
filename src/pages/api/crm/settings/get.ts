import type { APIRoute } from "astro";
import {
  getSessionCookieName,
  isValidSessionValue,
} from "../../../../lib/crm-auth";
import { getSiteSettings } from "../../../../lib/site-settings";

export const POST: APIRoute = async ({ cookies }) => {
  const session = cookies.get(getSessionCookieName())?.value;
  if (!isValidSessionValue(session)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const settings = await getSiteSettings();
    return new Response(JSON.stringify({ settings }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("CRM settings get failed:", error);
    return new Response(JSON.stringify({ message: "Unable to load settings" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

