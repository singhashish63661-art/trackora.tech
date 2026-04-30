import type { APIRoute } from "astro";
import { getSessionCookieName, isValidSessionValue } from "../../../lib/crm-auth";
import { getLeads } from "../../../lib/crm-store";

export const POST: APIRoute = async ({ cookies }) => {
  const session = cookies.get(getSessionCookieName())?.value;
  if (!isValidSessionValue(session)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const leads = await getLeads();
    return new Response(JSON.stringify({ leads }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("CRM leads fetch failed:", error);
    return new Response(JSON.stringify({ message: "Unable to fetch leads" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
