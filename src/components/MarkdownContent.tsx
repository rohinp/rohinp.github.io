import { Fragment } from "react";
import type { JSX } from "react";

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; order: "ul" | "ol"; items: string[] }
  | { type: "quote"; text: string };

type MarkdownContentProps = {
  source: string;
};

export default function MarkdownContent({ source }: MarkdownContentProps) {
  const blocks = parseMarkdown(source);

  return (
    <div className="mdx-content">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading": {
            const HeadingTag = `h${Math.min(3, block.level)}` as keyof JSX.IntrinsicElements;
            return (
              <HeadingTag key={`heading-${index}`} className="mdx-heading">
                {renderInline(block.text, `heading-${index}`)}
              </HeadingTag>
            );
          }
          case "paragraph":
            return (
              <p key={`paragraph-${index}`} className="mdx-paragraph">
                {renderInline(block.text, `paragraph-${index}`)}
              </p>
            );
          case "list":
            if (block.order === "ol") {
              return (
                <ol key={`list-${index}`} className="mdx-list ordered">
                  {block.items.map((item, itemIndex) => (
                    <li key={`list-${index}-${itemIndex}`} className="mdx-list-item">
                      {renderInline(item, `list-${index}-${itemIndex}`)}
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <ul key={`list-${index}`} className="mdx-list">
                {block.items.map((item, itemIndex) => (
                  <li key={`list-${index}-${itemIndex}`} className="mdx-list-item">
                    {renderInline(item, `list-${index}-${itemIndex}`)}
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote key={`quote-${index}`} className="mdx-quote">
                {renderInline(block.text, `quote-${index}`)}
              </blockquote>
            );
          default:
            return <Fragment key={`unknown-${index}`} />;
        }
      })}
    </div>
  );
}

function parseMarkdown(source: string): Block[] {
  const normalized = source.replace(/\r/g, "");
  const lines = normalized.split("\n");
  const blocks: Block[] = [];

  let paragraph: string[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let quote: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listType && listItems.length > 0) {
      blocks.push({ type: "list", order: listType, items: listItems });
    }
    listType = null;
    listItems = [];
  };

  const flushQuote = () => {
    if (quote.length > 0) {
      blocks.push({ type: "quote", text: quote.join(" ") });
      quote = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      flushQuote();
      blocks.push({ type: "heading", level: headingMatch[1].length, text: headingMatch[2].trim() });
      continue;
    }

    if (/^>\s+/.test(line)) {
      flushParagraph();
      flushList();
      quote.push(line.replace(/^>\s+/, "").trim());
      continue;
    }

    const unorderedMatch = line.match(/^[-*]\s+(.+)/);
    if (unorderedMatch) {
      flushParagraph();
      flushQuote();
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      listItems.push(unorderedMatch[1].trim());
      continue;
    }

    const orderedMatch = line.match(/^\d+\.\s+(.+)/);
    if (orderedMatch) {
      flushParagraph();
      flushQuote();
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      listItems.push(orderedMatch[1].trim());
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushQuote();

  return blocks;
}

function renderInline(text: string, keyPrefix: string) {
  const linkRegex = /\[(.+?)\]\((.+?)\)/g;
  const segments: Array<{ type: "text"; value: string } | { type: "link"; label: string; href: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: "link", label: match[1], href: match[2] });
    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }

  return segments.flatMap((segment, index) => {
    if (segment.type === "link") {
      return [
        <a key={`${keyPrefix}-link-${index}`} href={segment.href} target="_blank" rel="noreferrer" className="mdx-link">
          {segment.label}
        </a>,
      ];
    }
    return renderTextStyles(segment.value, `${keyPrefix}-text-${index}`);
  });
}

function renderTextStyles(text: string, keyPrefix: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);

  return tokens.map((token, index) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-bold-${index}`}>
          {token.slice(2, -2)}
        </strong>
      );
    }

    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code key={`${keyPrefix}-code-${index}`} className="mdx-inline-code">
          {token.slice(1, -1)}
        </code>
      );
    }

    return <Fragment key={`${keyPrefix}-plain-${index}`}>{token}</Fragment>;
  });
}
