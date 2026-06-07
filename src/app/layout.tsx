import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Link from "next/link";
import Providers from "./providers";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rohin Patel | Build Log",
  description: "A resume-inspired landing page with a simple markdown-powered blog.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const year = new Date().getFullYear();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
        <Providers>
          <div className="app-frame">
            <header className="site-header">
              <div className="brand-mark">
                <span className="brand-dot" aria-hidden />
                <div>
                  <p>Rohin Patel</p>
                  <small>Builder & Writer</small>
                </div>
              </div>
              <nav className="site-nav">
                <Link href="/">Resume</Link>
              </nav>
            </header>

            <main>{children}</main>

            <footer className="site-footer">
              <p>© {year} Rohin Patel. Crafted for GitHub Pages.</p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
