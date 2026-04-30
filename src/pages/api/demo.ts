import type { APIRoute } from "astro";
import { addLead } from "../../lib/crm-store";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = (await request.json()) as {
      name?: string;
      company?: string;
      fleetSize?: string;
      email?: string;
    };

    if (!data.name || !data.email) {
      return new Response(JSON.stringify({ message: "Name and email are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await addLead({
      type: "demo",
      name: data.name,
      email: data.email,
      company: data.company ?? "",
      fleetSize: data.fleetSize ?? "",
      subject: "Demo request",
      message: "Demo request submitted from modal.",
    });

    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Demo request failed:", error);
    return new Response(JSON.stringify({ message: "Error saving demo request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
