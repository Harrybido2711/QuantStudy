'use client'

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'

const components = {
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre {...props} className="overflow-x-auto rounded-xl" />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote {...props} className="border-l-4 border-indigo-400 pl-4 italic text-slate-600 dark:text-slate-400" />
  ),
}

export function MDXContent({ source }: { source: MDXRemoteSerializeResult }) {
  return (
    <div className="prose-custom">
      <MDXRemote {...source} components={components} />
    </div>
  )
}
