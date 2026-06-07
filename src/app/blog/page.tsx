import Link from "next/link";
import type { Metadata } from "next";
import { getGroupedPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Writing Log",
  description: "Notes grouped by year, powered by simple markdown files.",
};

function formatDate(dateIso: string) {
  return new Date(dateIso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function BlogIndexPage() {
  const grouped = await getGroupedPosts();
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="page-label">Writing Log</p>
          <h1>Notes, grouped by date.</h1>
          <p className="page-subtitle">
            Drop markdown files under <code>src/content/blog/&lt;year&gt;</code> and the site builds the rest.
          </p>
        </div>
        <div className="page-header__actions">
          <Link href="/" className="button ghost">Back to resume</Link>
          <a href="https://github.com/rohinp/rohinp.github.io" className="button" target="_blank" rel="noreferrer">
            View repo
          </a>
        </div>
      </header>

      {years.length === 0 && (
        <div className="empty-state">
          <p>No entries yet. Add a markdown file to kick things off.</p>
        </div>
      )}

      {years.map((year) => (
        <section key={year} className="year-cluster">
          <div className="year-marker">{year}</div>
          <div className="post-grid">
            {grouped[year]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((post) => (
                <article key={post.segment} className="post-card">
                  <div className="post-card__meta">
                    <span>{formatDate(post.date)}</span>
                    <span>{post.readingTimeMinutes} min read</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.summary}</p>
                  <Link href={`/blog/${post.year}/${post.segment}`} className="text-link">
                    Open note
                  </Link>
                </article>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
