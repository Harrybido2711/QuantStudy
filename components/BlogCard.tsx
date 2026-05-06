import Link from 'next/link'
import { format } from 'date-fns'
import type { ContentItem } from '@/lib/mdx'

export function BlogCard({ post }: { post: ContentItem }) {
  const { slug, frontmatter, readingTime } = post

  return (
    <Link href={`/blog/${slug}`} className="block card group">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
            {frontmatter.title}
          </h2>
          {frontmatter.description && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {frontmatter.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 flex-wrap">
        {frontmatter.tags?.slice(0, 4).map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-500">
        <time>{format(new Date(frontmatter.date), 'MMM d, yyyy')}</time>
        <span>·</span>
        <span>{readingTime}</span>
      </div>
    </Link>
  )
}
