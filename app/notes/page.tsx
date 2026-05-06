import { Metadata } from 'next'
import Link from 'next/link'
import { getAllNoteFolders, getNoteSlugsByFolder, getNote } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Organized knowledge folders covering deep learning, quant trading, system design, and more.',
}

const FOLDER_META: Record<string, { emoji: string; description: string }> = {
  'deep-learning': { emoji: '🧠', description: 'Neural networks, training, architectures, and optimization.' },
  'quant-trading': { emoji: '📈', description: 'Strategies, risk management, factor models, and execution.' },
  'system-design': { emoji: '🏗️', description: 'Scalability, distributed systems, databases, and architecture.' },
  'probability': { emoji: '🎲', description: 'Probability theory, distributions, and stochastic processes.' },
  'statistics': { emoji: '📊', description: 'Statistical inference, regression, and hypothesis testing.' },
  'operating-systems': { emoji: '⚙️', description: 'OS concepts, memory management, scheduling.' },
}

export default function NotesPage() {
  const folders = getAllNoteFolders()

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Notes</h1>
        <p className="text-slate-600 dark:text-slate-400">
          {folders.length} folders of organized knowledge.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {folders.map(folder => {
          const slugs = getNoteSlugsByFolder(folder)
          const meta = FOLDER_META[folder] ?? { emoji: '📁', description: '' }

          return (
            <Link key={folder} href={`/notes/${folder}`} className="card group flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{meta.emoji}</span>
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors capitalize">
                    {folder.replace(/-/g, ' ')}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{slugs.length} note{slugs.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              {meta.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{meta.description}</p>
              )}
            </Link>
          )
        })}
        {folders.length === 0 && (
          <div className="col-span-3 text-center py-16 text-slate-500 dark:text-slate-400">
            <p className="text-4xl mb-3">📂</p>
            <p>No folders yet. Create them inside <code className="text-xs">content/notes/</code></p>
          </div>
        )}
      </div>
    </div>
  )
}
