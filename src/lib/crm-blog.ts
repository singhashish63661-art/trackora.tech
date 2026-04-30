import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

export interface BlogPostData {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  img?: string;
  featured?: boolean;
}

export interface BlogPostRecord extends BlogPostData {
  slug: string;
  body: string;
}

function blogDir() {
  return path.join(process.cwd(), "src/content/blog");
}

function blogImagesDir() {
  return path.join(process.cwd(), "public/assets/blog-images");
}

function safeSlug(slug: string) {
  const normalized = slug.trim().toLowerCase();
  const ok = /^[a-z0-9-]+$/.test(normalized);
  return ok ? normalized : "";
}

export function slugify(input: string) {
  const s = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return safeSlug(s);
}

function yamlEscape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function parseFrontmatterAndBody(raw: string) {
  const lines = raw.split(/\r?\n/);
  if (lines.length === 0 || lines[0].trim() !== "---") {
    return { data: {}, body: raw };
  }

  let i = 1;
  for (; i < lines.length; i++) {
    if (lines[i].trim() === "---") break;
  }

  const fmLines = lines.slice(1, i);
  const body = lines.slice(i + 1).join("\n");
  const data: Record<string, any> = {};

  for (const line of fmLines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    // Remove wrapping quotes
    value = value.replace(/^['"]/, "").replace(/['"]$/, "");

    if (value === "true") data[key] = true;
    else if (value === "false") data[key] = false;
    else data[key] = value;
  }

  return { data, body };
}

function buildMarkdownFile(post: BlogPostData, body: string) {
  const lines: string[] = ["---"];
  lines.push(`title: "${yamlEscape(post.title)}"`);
  lines.push(`excerpt: "${yamlEscape(post.excerpt)}"`);
  lines.push(`category: "${yamlEscape(post.category)}"`);
  lines.push(`date: "${yamlEscape(post.date)}"`);
  lines.push(`readTime: "${yamlEscape(post.readTime)}"`);
  if (post.img && post.img.trim()) {
    lines.push(`img: "${yamlEscape(post.img.trim())}"`);
  }
  lines.push(`featured: ${post.featured ? "true" : "false"}`);
  lines.push("---");
  lines.push("");
  lines.push(body.trimStart());
  lines.push("");
  return lines.join("\n");
}

export async function listBlogPosts(): Promise<Omit<BlogPostRecord, "body">[]> {
  const dir = blogDir();
  const files = await fs.readdir(dir);
  const mdFiles = files.filter((f) => f.endsWith(".md"));

  const posts: Omit<BlogPostRecord, "body">[] = [];
  for (const file of mdFiles) {
    const slug = file.replace(/\.md$/, "");
    const raw = await fs.readFile(path.join(dir, file), "utf-8");
    const { data } = parseFrontmatterAndBody(raw);
    if (!data.title) continue;

    posts.push({
      slug,
      title: String(data.title ?? ""),
      excerpt: String(data.excerpt ?? ""),
      category: String(data.category ?? ""),
      date: String(data.date ?? ""),
      readTime: String(data.readTime ?? ""),
      img: data.img ? String(data.img) : undefined,
      featured: Boolean(data.featured),
    });
  }

  // Featured first
  posts.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return posts;
}

export async function getBlogPost(slug: string): Promise<BlogPostRecord | null> {
  const cleanSlug = safeSlug(slug);
  if (!cleanSlug) return null;

  const filePath = path.join(blogDir(), `${cleanSlug}.md`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const { data, body } = parseFrontmatterAndBody(raw);
    if (!data.title) return null;

    return {
      slug: cleanSlug,
      title: String(data.title ?? ""),
      excerpt: String(data.excerpt ?? ""),
      category: String(data.category ?? ""),
      date: String(data.date ?? ""),
      readTime: String(data.readTime ?? ""),
      img: data.img ? String(data.img) : undefined,
      featured: Boolean(data.featured),
      body,
    };
  } catch {
    return null;
  }
}

export async function saveBlogPost(input: {
  slug: string;
  data: BlogPostData;
  body: string;
}): Promise<{ slug: string }> {
  const cleanSlug = safeSlug(input.slug);
  if (!cleanSlug) throw new Error("Invalid slug");

  await fs.mkdir(blogDir(), { recursive: true });
  const filePath = path.join(blogDir(), `${cleanSlug}.md`);

  // If we’re overwriting an existing post, cleanup previous cover image if replaced.
  let previousImg: string | undefined = undefined;
  try {
    const existingRaw = await fs.readFile(filePath, "utf-8");
    const parsed = parseFrontmatterAndBody(existingRaw);
    if (parsed.data?.img) previousImg = String(parsed.data.img);
  } catch {
    // No existing post.
  }

  const markdown = buildMarkdownFile(input.data, input.body);
  await fs.writeFile(filePath, markdown, "utf-8");

  const nextImg = input.data.img;
  if (previousImg && previousImg.startsWith("/assets/blog-images/") && nextImg !== previousImg) {
    const fileName = previousImg.replace("/assets/blog-images/", "");
    const imagePath = path.join(blogImagesDir(), fileName);
    try {
      await fs.unlink(imagePath);
    } catch {
      // ignore
    }
  }

  return { slug: cleanSlug };
}

export async function deleteBlogPost(slug: string): Promise<{ ok: boolean }> {
  const cleanSlug = safeSlug(slug);
  if (!cleanSlug) throw new Error("Invalid slug");

  const filePath = path.join(blogDir(), `${cleanSlug}.md`);
  let imgUrl: string | undefined = undefined;

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = parseFrontmatterAndBody(raw);
    if (parsed.data?.img) imgUrl = String(parsed.data.img);
  } catch {
    // Continue to try deleting anyway
  }

  try {
    await fs.unlink(filePath);
  } catch {
    // ignore
  }

  // Best-effort cover image cleanup
  if (imgUrl && imgUrl.startsWith("/assets/blog-images/")) {
    const fileName = imgUrl.replace("/assets/blog-images/", "");
    const imagePath = path.join(blogImagesDir(), fileName);
    try {
      await fs.unlink(imagePath);
    } catch {
      // ignore
    }
  }

  return { ok: true };
}

export async function saveCoverImage(file: File, slug: string): Promise<string> {
  const dir = blogImagesDir();
  await fs.mkdir(dir, { recursive: true });

  const originalName = file.name || "cover";
  const extFromName = path.extname(originalName);
  let ext = extFromName || ".png";

  // If ext isn't from name, infer from MIME
  if (!ext || ext === ".") {
    if (file.type === "image/jpeg") ext = ".jpg";
    else if (file.type === "image/png") ext = ".png";
    else if (file.type === "image/webp") ext = ".webp";
    else if (file.type === "image/gif") ext = ".gif";
  }

  const safeExt = ext.replace(/[^a-zA-Z0-9.]/g, "");
  const fileName = `${slug}-${Date.now()}-${randomUUID().slice(0, 8)}${safeExt}`;
  const filePath = path.join(dir, fileName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(filePath, buffer);

  return `/assets/blog-images/${fileName}`;
}

