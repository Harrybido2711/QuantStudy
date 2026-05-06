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
import { getAllNoteFolders, getNoteSlugsByFolder, getNote } from '@/lib/mdx'
import { TableOfContents } from '@/components/TableOfContents'

interface Props {
  params: Promise<{ folder: string; slug: string }>
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
  return getAllNoteFolders().flatMap(folder =>
    getNoteSlugsByFolder(folder).map(slug => ({ folder, slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { folder, slug } = await params
  try {
    const { frontmatter } = getNote(folder, slug)
    return { title: frontmatter.title, description: frontmatter.description }
  } catch {
    return {}
  }
}

export default async function NotePage({ params }: Props) {
  const { folder, slug } = await params

  let note: ReturnType<typeof getNote>
  try {
    note = getNote(folder, slug)
  } catch {
    notFound()
  }

  const { frontmatter, content, readingTime } = note!

  // Prev/Next within same folder
  const slugs = getNoteSlugsByFolder(folder)
  const idx = slugs.indexOf(slug)
  const prevSlug = slugs[idx - 1] ?? null
  const nextSlug = slugs[idx + 1] ?? null
  const prevNote = prevSlug ? getNote(folder, prevSlug) : null
  const nextNote = nextSlug ? getNote(folder, nextSlug) : null

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="flex gap-12">
        <div className="min-w-0 flex-1">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8">
            <Link href="/notes" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Notes</Link>
            <span>/</span>
            <Link href={`/notes/${folder}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors capitalize">
              {folder.replace(/-/g, ' ')}
            </Link>
          </div>

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
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">{frontmatter.description}</p>
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

          {/* Prev/Next */}
          <nav className="mt-16 grid grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-800 pt-8">
            {prevNote ? (
              <Link href={`/notes/${folder}/${prevSlug}`} className="group">
                <p className="text-xs text-slate-500 mb-1">← Previous</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {prevNote.frontmatter.title}
                </p>
              </Link>
            ) : <div />}
            {nextNote ? (
              <Link href={`/notes/${folder}/${nextSlug}`} className="group text-right">
                <p className="text-xs text-slate-500 mb-1">Next →</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {nextNote.frontmatter.title}
                </p>
              </Link>
            ) : <div />}
          </nav>
        </div>

        <aside className="hidden lg:block w-52 shrink-0">
          <TableOfContents />
        </aside>
      </div>
    </div>
  )
}
