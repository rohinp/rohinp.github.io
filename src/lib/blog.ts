import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

export interface BlogPostMeta {
  year: string;
  segment: string; // filename without extension (includes date prefix)
  slug: string; // human readable slug without the leading date
  date: string; // ISO string
  title: string;
  summary: string;
  readingTimeMinutes: number;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

const BLOG_ROOT = path.join(process.cwd(), "src/content/blog");
const MARKDOWN_EXTENSIONS = new Set([".md", ".mdx"]);

export async function getGroupedPosts(): Promise<Record<string, BlogPostMeta[]>> {
  const posts = await getAllPosts();
  return posts.reduce<Record<string, BlogPostMeta[]>>((groups, post) => {
    if (!groups[post.year]) {
      groups[post.year] = [];
    }
    groups[post.year].push(toSummary(post));
    return groups;
  }, {});
}

export async function getAllPostParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ year: post.year, segment: post.segment }));
}

export async function getPost(year: string, segment: string): Promise<BlogPost> {
  const fileName = await findFileForSegment(year, segment);
  if (!fileName) {
    throw new Error("POST_NOT_FOUND");
  }
  return buildPost(year, fileName);
}

async function getAllPosts(): Promise<BlogPost[]> {
  const years = await listYearFolders();
  const posts: BlogPost[] = [];

  for (const year of years) {
    const files = await listMarkdownFiles(path.join(BLOG_ROOT, year));
    for (const file of files) {
      posts.push(await buildPost(year, file));
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

async function buildPost(year: string, fileName: string): Promise<BlogPost> {
  const filePath = path.join(BLOG_ROOT, year, fileName);
  const raw = await fs.readFile(filePath, "utf8");
  const { date, slug, segment } = parseFileName(fileName);
  const isoDate = new Date(`${date}T00:00:00Z`).toISOString();

  return {
    year,
    segment,
    slug,
    date: isoDate,
    title: extractTitle(raw, slug),
    summary: extractSummary(raw),
    readingTimeMinutes: calculateReadingTime(raw),
    content: raw,
  };
}

async function listYearFolders(): Promise<string[]> {
  try {
    const entries = await fs.readdir(BLOG_ROOT, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
  } catch {
    return [];
  }
}

async function listMarkdownFiles(folder: string) {
  try {
    const files = await fs.readdir(folder);
    return files.filter((file) => MARKDOWN_EXTENSIONS.has(path.extname(file).toLowerCase()));
  } catch {
    return [];
  }
}

async function findFileForSegment(year: string, segment: string) {
  const folder = path.join(BLOG_ROOT, year);
  try {
    const files = await fs.readdir(folder);
    return files.find((file) => removeExtension(file) === segment);
  } catch {
    return undefined;
  }
}

function parseFileName(fileName: string) {
  const base = removeExtension(fileName);
  const match = base.match(/^(\d{4}-\d{2}-\d{2})(?:-(.+))?$/);
  if (!match) {
    throw new Error(`Invalid blog file name: ${fileName}`);
  }

  const [, date, slugPart] = match;
  const slug = (slugPart ?? date).replace(/[^a-z0-9-]+/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase();

  return { date, slug: slug || date, segment: base };
}

function extractTitle(markdown: string, fallback: string) {
  const headingMatch = markdown.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1].trim();
  }
  return toTitleCase(fallback.replace(/-/g, " "));
}

function extractSummary(markdown: string) {
  const blocks = markdown
    .replace(/^#.+$/gm, "")
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\n/g, " ").trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return "Untitled journal entry";
  }

  const snippet = blocks[0];
  return snippet.length > 220 ? `${snippet.slice(0, 217)}...` : snippet;
}

function calculateReadingTime(markdown: string) {
  const words = markdown
    .replace(/[`*_>#-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function toTitleCase(input: string) {
  return input
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function removeExtension(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "");
}

function toSummary(post: BlogPost): BlogPostMeta {
  return {
    year: post.year,
    segment: post.segment,
    slug: post.slug,
    date: post.date,
    title: post.title,
    summary: post.summary,
    readingTimeMinutes: post.readingTimeMinutes,
  };
}
