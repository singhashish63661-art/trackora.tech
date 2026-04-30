import type { APIRoute } from "astro";
import {
  getSessionCookieName,
  isValidSessionValue,
} from "../../../../../lib/crm-auth";
import { getHomeSettings } from "../../../../../lib/home-settings";

export const POST: APIRoute = async ({ cookies }) => {
  const session = cookies.get(getSessionCookieName())?.value;
  if (!isValidSessionValue(session)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const settings = await getHomeSettings();
    return new Response(JSON.stringify({ settings }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Home settings get failed:", error);
    return new Response(JSON.stringify({ message: "Unable to load settings" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

