import type { APIRoute } from "astro";
import { getSessionCookieName, isValidSessionValue } from "../../../lib/crm-auth";
import { updateLeadStatus, type LeadStatus } from "../../../lib/crm-store";

const ALLOWED_STATUSES: LeadStatus[] = ["new", "in_progress", "won", "closed"];

export const PATCH: APIRoute = async ({ request, cookies }) => {
  const session = cookies.get(getSessionCookieName())?.value;
  if (!isValidSessionValue(session)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = (await request.json()) as { id?: string; status?: LeadStatus };

  if (!body.id) {
    return new Response(JSON.stringify({ message: "Lead id is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.status || !ALLOWED_STATUSES.includes(body.status)) {
    return new Response(JSON.stringify({ message: "Invalid lead status" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const lead = await updateLeadStatus(body.id, body.status);
    if (!lead) {
      return new Response(JSON.stringify({ message: "Lead not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ lead }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("CRM lead update failed:", error);
    return new Response(JSON.stringify({ message: "Unable to update lead" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
