import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell empty-state">
      <p>The entry you are looking for is missing or has been renamed.</p>
      <Link href="/blog" className="button ghost">
        Return to the log
      </Link>
    </div>
  );
}
