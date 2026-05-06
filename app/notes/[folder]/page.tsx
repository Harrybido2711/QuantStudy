import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { getAllNoteFolders, getNoteSlugsByFolder, getNote } from '@/lib/mdx'

interface Props {
  params: Promise<{ folder: string }>
}

export async function generateStaticParams() {
  return getAllNoteFolders().map(folder => ({ folder }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { folder } = await params
  const label = folder.replace(/-/g, ' ')
  return {
    title: label.charAt(0).toUpperCase() + label.slice(1),
    description: `Notes on ${label}.`,
  }
}

export default async function FolderPage({ params }: Props) {
  const { folder } = await params
  const folders = getAllNoteFolders()
  if (!folders.includes(folder)) notFound()

  const slugs = getNoteSlugsByFolder(folder)
  const notes = slugs.map(slug => {
    const { frontmatter, readingTime } = getNote(folder, slug)
    return { slug, frontmatter, readingTime }
  }).sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())

  const folderLabel = folder.replace(/-/g, ' ')

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <Link
        href="/notes"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors"
      >
        ← All Folders
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white capitalize mb-2">
          {folderLabel}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="space-y-4">
        {notes.map(({ slug, frontmatter, readingTime }) => (
          <Link key={slug} href={`/notes/${folder}/${slug}`} className="card group block">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
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
        ))}
        {notes.length === 0 && (
          <p className="text-slate-500 text-sm">No notes yet in this folder.</p>
        )}
      </div>
    </div>
  )
}
