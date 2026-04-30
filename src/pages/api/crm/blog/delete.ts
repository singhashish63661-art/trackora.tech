import type { APIRoute } from "astro";
import { getSessionCookieName, isValidSessionValue } from "../../../../lib/crm-auth";
import { deleteBlogPost } from "../../../../lib/crm-blog";

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = cookies.get(getSessionCookieName())?.value;
  if (!isValidSessionValue(session)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await request.json()) as { slug?: string };
    const slug = String(body.slug || "");
    if (!slug) {
      return new Response(JSON.stringify({ message: "Slug is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await deleteBlogPost(slug);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("CRM blog delete failed:", error);
    return new Response(JSON.stringify({ message: "Unable to delete blog post" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};

