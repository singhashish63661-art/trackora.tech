import type { APIRoute } from "astro";
import { getSessionCookieName, isValidSessionValue } from "../../../lib/crm-auth";

export const POST: APIRoute = async ({ cookies }) => {
  const session = cookies.get(getSessionCookieName())?.value;
  const authenticated = isValidSessionValue(session);
  return new Response(JSON.stringify({ authenticated }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
