import type { APIRoute } from "astro";
import {
  getSessionCookieName,
  isValidSessionValue,
} from "../../../../lib/crm-auth";
import { getBlogPost } from "../../../../lib/crm-blog";

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

    const post = await getBlogPost(slug);
    if (!post) {
      return new Response(JSON.stringify({ message: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return exactly what's needed by the CRM UI
    return new Response(JSON.stringify({ post }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("CRM blog get failed:", error);
    return new Response(JSON.stringify({ message: "Unable to load post" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};

