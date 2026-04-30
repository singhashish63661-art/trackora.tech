import type { APIRoute } from "astro";
import { getSessionCookieName } from "../../../lib/crm-auth";

export const POST: APIRoute = async ({ cookies }) => {
  cookies.delete(getSessionCookieName(), { path: "/" });
  return new Response(JSON.stringify({ message: "Logged out" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
