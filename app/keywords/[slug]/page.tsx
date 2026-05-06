import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import { getAllKeywordSlugs, getKeyword, getAllKeywords } from '@/lib/mdx'

interface Props {
  params: Promise<{ slug: string }>
}

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex, rehypeSlug, rehypeHighlight] as never[],
  },
}

export async function generateStaticParams() {
  return getAllKeywordSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const { frontmatter } = getKeyword(slug)
    return { title: frontmatter.title, description: frontmatter.description }
  } catch {
    return {}
  }
}

export default async function KeywordPage({ params }: Props) {
  const { slug } = await params

  let kw: ReturnType<typeof getKeyword>
  try {
    kw = getKeyword(slug)
  } catch {
    notFound()
  }

  const { frontmatter, content } = kw!
  const allKeywords = getAllKeywords()
  const related = allKeywords.filter(k =>
    frontmatter.relatedTerms?.includes(k.slug) && k.slug !== slug
  )

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <Link
        href="/keywords"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors"
      >
        ← Glossary
      </Link>

      <header className="mb-10">
        {frontmatter.category && (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 mb-4 capitalize">
            {frontmatter.category.replace(/-/g, ' ')}
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          {frontmatter.title}
        </h1>
        {frontmatter.description && (
          <p className="text-lg text-slate-600 dark:text-slate-400">{frontmatter.description}</p>
        )}
      </header>

      <article className="prose-custom">
        <MDXRemote source={content} options={mdxOptions} />
      </article>

      {/* Related terms */}
      {related.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
            Related Terms
          </h2>
          <div className="flex flex-wrap gap-2">
            {related.map(r => (
              <Link key={r.slug} href={`/keywords/${r.slug}`} className="tag text-sm py-1 px-3">
                {r.frontmatter.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {frontmatter.references && frontmatter.references.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">
            References
          </h2>
          <ul className="space-y-1">
            {frontmatter.references.map((ref, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-400">{ref}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
