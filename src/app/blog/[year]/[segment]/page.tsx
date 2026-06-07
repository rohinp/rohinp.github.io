import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarkdownContent from "@/components/MarkdownContent";
import { getAllPostParams, getPost } from "@/lib/blog";

type BlogRouteParams = {
  year: string;
  segment: string;
};

function formatFullDate(dateIso: string) {
  return new Date(dateIso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateStaticParams() {
  return getAllPostParams();
}

export async function generateMetadata({ params }: { params: Promise<BlogRouteParams> }): Promise<Metadata> {
  try {
    const resolved = await params;
    const post = await getPost(resolved.year, resolved.segment);
    return {
      title: `${post.title} · ${resolved.year}`,
      description: post.summary,
    };
  } catch {
    return {
      title: "Entry not found",
      description: "The requested note could not be located.",
    };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<BlogRouteParams> }) {
  try {
    const resolved = await params;
    const post = await getPost(resolved.year, resolved.segment);

    return (
      <article className="page-shell post-detail">
        <div className="back-row">
          <Link href="/blog" className="text-link">
            ← Back to all notes
          </Link>
          <span className="chip">{post.year}</span>
        </div>

        <p className="page-label">{formatFullDate(post.date)}</p>
        <h1>{post.title}</h1>

        <div className="post-card__meta">
          <span>{post.readingTimeMinutes} min read</span>
          <span>{post.segment}</span>
        </div>

        <MarkdownContent source={post.content} />
      </article>
    );
  } catch {
    notFound();
  }
}
