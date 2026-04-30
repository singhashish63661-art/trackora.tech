import type { APIRoute } from "astro";
import {
  getSessionCookieName,
  isValidSessionValue,
} from "../../../../lib/crm-auth";
import {
  listBlogPosts,
  getBlogPost,
  saveBlogPost,
  saveCoverImage,
  slugify,
  type BlogPostData,
} from "../../../../lib/crm-blog";

function getRequired(value: string, name: string) {
  if (!value || !value.trim()) throw new Error(`${name} is required`);
  return value.trim();
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = cookies.get(getSessionCookieName())?.value;
  if (!isValidSessionValue(session)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const formData = await request.formData();

    const title = String(formData.get("title") || "");
    const slugInput = String(formData.get("slug") || "");
    const excerpt = String(formData.get("excerpt") || "");
    const category = String(formData.get("category") || "");
    const date = String(formData.get("date") || "");
    const readTime = String(formData.get("readTime") || "");
    const featuredRaw = String(formData.get("featured") || "");
    const removeCoverImageRaw = String(
      formData.get("removeCoverImage") || "",
    );
    const coverImageUrl = String(formData.get("coverImageUrl") || "");
    const body = String(formData.get("body") || "");

    const coverImageFile = formData.get("coverImage");

    const slug = slugify(slugInput || title);
    const cleanTitle = getRequired(title, "title");
    const cleanExcerpt = getRequired(excerpt, "excerpt");
    const cleanCategory = getRequired(category, "category");
    const cleanDate = getRequired(date, "date");
    const cleanReadTime = getRequired(readTime, "readTime");
    const cleanBody = body.trimStart();

    if (!slug) {
      return new Response(JSON.stringify({ message: "Invalid slug" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let img: string | undefined = coverImageUrl.trim() || undefined;

    if (coverImageFile && coverImageFile instanceof File && coverImageFile.size > 0) {
      img = await saveCoverImage(coverImageFile, slug);
    }

    const removeCoverImage =
      removeCoverImageRaw === "on" ||
      removeCoverImageRaw === "true" ||
      removeCoverImageRaw === "1";

    if (removeCoverImage) {
      img = undefined;
    } else if (!img) {
      // If the admin didn't provide a new cover image, preserve the old one (on overwrite).
      const existing = await getBlogPost(slug);
      if (existing?.img) img = existing.img;
    }

    const data: BlogPostData = {
      title: cleanTitle,
      excerpt: cleanExcerpt,
      category: cleanCategory,
      date: cleanDate,
      readTime: cleanReadTime,
      img,
      featured: featuredRaw === "on" || featuredRaw === "true" || featuredRaw === "1",
    };

    await saveBlogPost({
      slug,
      data,
      body: cleanBody || " ",
    });

    // Ensure images list generation won't fail with stale reads
    await listBlogPosts();

    return new Response(JSON.stringify({ ok: true, slug }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("CRM blog save failed:", error);
    const message =
      error instanceof Error ? error.message : "Unable to save blog post";
    return new Response(JSON.stringify({ message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};

