import type { APIRoute } from "astro";
import {
  createSessionCookieValue,
  getSessionCookieName,
  getSessionMaxAgeSeconds,
  isAuthConfigured,
  isValidAdminPassword,
} from "../../../lib/crm-auth";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const rawBody = await request.text();
    if (!rawBody) {
      return new Response(JSON.stringify({ message: "Password is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = JSON.parse(rawBody) as { password?: string };
    const password = body.password ?? "";

    if (!isAuthConfigured()) {
      return new Response(
        JSON.stringify({
          message:
            "CRM auth is not configured. Set CRM_ADMIN_PASSWORD (and optional CRM_SESSION_SECRET) in your host environment, e.g. Vercel → Settings → Environment Variables, then redeploy.",
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (!isValidAdminPassword(password)) {
      return new Response(JSON.stringify({ message: "Invalid password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    cookies.set(getSessionCookieName(), createSessionCookieValue(), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: import.meta.env.PROD,
      maxAge: getSessionMaxAgeSeconds(),
    });

    return new Response(JSON.stringify({ message: "Authenticated" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return new Response(JSON.stringify({ message: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.error("CRM login failed:", error);
    return new Response(JSON.stringify({ message: "Unable to login" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
