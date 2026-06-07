import { cache } from "react";
import type {
  AnchorHTMLAttributes,
  BlockquoteHTMLAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
} from "react";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

type MarkdownContentProps = {
  source: string;
};

const getMDXComponent = cache(async (source: string) => {
  const compiled = await compile(source, {
    outputFormat: "function-body",
    development: process.env.NODE_ENV === "development",
  });

  const { default: Content } = await run(compiled, runtime);
  return Content;
});

const mdxComponents = {
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => <h1 className="mdx-heading" {...props} />,
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => <h2 className="mdx-heading" {...props} />,
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => <h3 className="mdx-heading" {...props} />,
  p: (props: HTMLAttributes<HTMLParagraphElement>) => <p className="mdx-paragraph" {...props} />,
  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a className="mdx-link" {...props} />,
  ul: (props: HTMLAttributes<HTMLUListElement>) => <ul className="mdx-list" {...props} />,
  ol: (props: OlHTMLAttributes<HTMLOListElement>) => <ol className="mdx-list ordered" {...props} />,
  li: (props: LiHTMLAttributes<HTMLLIElement>) => <li className="mdx-list-item" {...props} />,
  blockquote: (props: BlockquoteHTMLAttributes<HTMLQuoteElement>) => <blockquote className="mdx-quote" {...props} />,
  code: (props: HTMLAttributes<HTMLElement>) => <code className="mdx-inline-code" {...props} />,
  pre: (props: HTMLAttributes<HTMLPreElement>) => <pre className="mdx-code" {...props} />,
};

export default async function MarkdownContent({ source }: MarkdownContentProps) {
  const Content = await getMDXComponent(source);
  return (
    <div className="mdx-content">
      {/* @ts-expect-error -- MDX runtime returns a valid component */}
      <Content components={mdxComponents} />
    </div>
  );
}
