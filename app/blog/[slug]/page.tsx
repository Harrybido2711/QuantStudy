import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import { getAllBlogSlugs, getAllBlogPosts, getBlogPost } from '@/lib/mdx'
import { TableOfContents } from '@/components/TableOfContents'

interface Props {
  params: Promise<{ slug: string }>
}

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeKatex,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      rehypeHighlight,
    ] as never[],
  },
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const { frontmatter } = getBlogPost(slug)
    return {
      title: frontmatter.title,
      description: frontmatter.description,
      openGraph: { title: frontmatter.title, description: frontmatter.description },
    }
  } catch {
    return {}
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  let post: ReturnType<typeof getBlogPost>
  try {
    post = getBlogPost(slug)
  } catch {
    notFound()
  }

  const { frontmatter, content, readingTime } = post!
  const allPosts = getAllBlogPosts()
  const idx = allPosts.findIndex(p => p.slug === slug)
  const prev = allPosts[idx + 1] ?? null
  const next = allPosts[idx - 1] ?? null

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="flex gap-12">
        {/* Article */}
        <div className="min-w-0 flex-1">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors"
          >
            ← Back to Blog
          </Link>

          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              {frontmatter.tags?.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              {frontmatter.title}
            </h1>
            {frontmatter.description && (
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                {frontmatter.description}
              </p>
            )}
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-4">
              <time>{format(new Date(frontmatter.date), 'MMMM d, yyyy')}</time>
              <span>·</span>
              <span>{readingTime}</span>
            </div>
          </header>

          <article className="prose-custom">
            <MDXRemote source={content} options={mdxOptions} />
          </article>

          {/* Prev / Next navigation */}
          <nav className="mt-16 grid grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-800 pt-8">
            {prev ? (
              <Link href={`/blog/${prev.slug}`} className="group">
                <p className="text-xs text-slate-500 mb-1">← Previous</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {prev.frontmatter.title}
                </p>
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/blog/${next.slug}`} className="group text-right">
                <p className="text-xs text-slate-500 mb-1">Next →</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {next.frontmatter.title}
                </p>
              </Link>
            ) : <div />}
          </nav>
        </div>

        {/* Table of Contents */}
        <aside className="hidden lg:block w-52 shrink-0">
          <TableOfContents />
        </aside>
      </div>
    </div>
  )
}
