"use client"

import ReactMarkdown, { type Components } from "react-markdown"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"
import { ArrowUpRight } from "lucide-react"

import { BrandIcon, brandForUrl, brands } from "@/components/brand/brand-icons"

/**
 * Replies quote email content, which may carry hostile HTML. react-markdown
 * never renders raw HTML, and rehype-sanitize strips anything unsafe
 * (e.g. javascript: links) on top of that (docs/API.md "Security notes").
 */
const components: Components = {
  a({ href, children }) {
    const brand = href ? brandForUrl(href) : null
    if (brand) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-0.5 inline-flex max-w-full items-center gap-1.5 rounded-md border bg-card px-1.5 py-0.5 align-middle text-[13px] font-medium no-underline transition hover:border-foreground/20 hover:bg-muted"
          title={`Open in ${brands[brand].name}`}
        >
          <BrandIcon brand={brand} className="size-3.5" />
          <span className="truncate">{children}</span>
          <ArrowUpRight className="size-3 shrink-0 text-muted-foreground" />
        </a>
      )
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-foreground underline decoration-brand/50 underline-offset-[3px] hover:decoration-brand"
      >
        {children}
      </a>
    )
  },
  ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5 marker:text-muted-foreground">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-muted-foreground">{children}</ol>,
  p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  h1: ({ children }) => <p className="mt-3 mb-1 font-semibold">{children}</p>,
  h2: ({ children }) => <p className="mt-3 mb-1 font-semibold">{children}</p>,
  h3: ({ children }) => <p className="mt-3 mb-1 font-semibold">{children}</p>,
  code: ({ children }) => (
    <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="scrollbar-thin my-2 overflow-x-auto rounded-lg bg-muted p-3 text-[13px]">{children}</pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-brand/40 pl-3 text-muted-foreground">{children}</blockquote>
  ),
  table: ({ children }) => (
    <div className="scrollbar-thin my-2 overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b px-2 py-1 text-left font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-b px-2 py-1 align-top">{children}</td>,
  hr: () => <hr className="my-3" />,
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="text-[15px] leading-relaxed break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
