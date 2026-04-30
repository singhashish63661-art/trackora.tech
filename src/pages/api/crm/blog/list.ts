import type { APIRoute } from "astro";
import { getSessionCookieName, isValidSessionValue } from "../../../../lib/crm-auth";
import { listBlogPosts } from "../../../../lib/crm-blog";

export const POST: APIRoute = async ({ cookies }) => {
  const session = cookies.get(getSessionCookieName())?.value;
  if (!isValidSessionValue(session)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const posts = await listBlogPosts();
    return new Response(JSON.stringify({ posts }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("CRM blog list failed:", error);
    return new Response(JSON.stringify({ message: "Unable to list blog posts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

