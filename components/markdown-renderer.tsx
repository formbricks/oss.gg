import { cn } from "@/lib/utils";
import React from "react";
import ReactMarkdown, { Options } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula as codeTheme } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

export const MarkdownRenderer = ({ content }: { content: string }) => {
  const components: Options["components"] = {
    h1: ({ children, ...props }) => (
      <h1 className="mb-2 mt-4 text-3xl font-bold" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="mb-2 mt-4 text-2xl font-semibold" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="mb-2 mt-4 text-xl font-medium" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 className="mb-2 mt-4 text-lg font-normal" {...props}>
        {children}
      </h4>
    ),
    h5: ({ children, ...props }) => (
      <h5 className="mb-2 mt-4 text-base font-normal" {...props}>
        {children}
      </h5>
    ),
    h6: ({ children, ...props }) => (
      <h6 className="mb-2 mt-4 text-sm font-normal" {...props}>
        {children}
      </h6>
    ),
    p: ({ children, ...props }) => (
      <p className="mb-2 mt-4" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="mb-2 mt-4 list-inside list-disc" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="mb-2 mt-4 list-inside list-decimal" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="mb-2 mt-4" {...props}>
        {/* if children is p tag, then render it as a span */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child?.props?.node?.tagName === "p") {
            return <span>{child.props.children}</span>;
          }
          return child;
        })}
      </li>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote className="mb-2 mt-4 border-l-4 border-slate-300 pl-2" {...props}>
        {children}
      </blockquote>
    ),
    hr: ({ ...props }) => <hr className="my-4 border-slate-300" {...props} />,
    br: ({ ...props }) => <br {...props} />,
    a: ({ children, ...props }) => (
      <a className="inline-block text-current underline" {...props} target="_blank">
        {children}
      </a>
    ),
    code: ({ className, inline, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");

      if (inline) {
        return (
          <code className={cn(className, "rounded-sm bg-gray-200 px-1 py-0.5 text-sm text-black")} {...props}>
            {children}
          </code>
        );
      }

      return (
        <SyntaxHighlighter
          language={(match && match[1]) || ""}
          style={codeTheme}
          wrapLongLines
          customStyle={{
            backgroundColor: "hsl(var(--muted))",
            borderRadius: "0.5rem",
          }}>
          {children as string}
        </SyntaxHighlighter>
      );
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={components}>
      {content}
    </ReactMarkdown>
  );
};
