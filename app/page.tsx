import Link from 'next/link'
import { getAllBlogPosts, getAllKeywords, getAllNoteFolders } from '@/lib/mdx'
import { BlogCard } from '@/components/BlogCard'
import { format } from 'date-fns'

export default function HomePage() {
  const posts = getAllBlogPosts().slice(0, 5)
  const keywords = getAllKeywords().slice(0, 8)
  const folders = getAllNoteFolders()

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">

      {/* Hero */}
      <section className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          Personal Knowledge Hub
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
          Finance · Quant · AI · Systems
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          A living research notebook. Notes on quantitative finance, machine learning,
          distributed systems, and the intersection of all three.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/blog" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
            Read the Blog
          </Link>
          <Link href="/notes" className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Browse Notes
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Posts */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Posts</h2>
            <Link href="/blog" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {posts.map(post => (
              <BlogCard key={post.slug} post={post} />
            ))}
            {posts.length === 0 && (
              <p className="text-slate-500 dark:text-slate-400 text-sm">No posts yet. Start writing in <code className="text-xs">content/blog/</code></p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Knowledge Folders */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notes</h2>
              <Link href="/notes" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                All →
              </Link>
            </div>
            <div className="space-y-2">
              {folders.map(folder => (
                <Link
                  key={folder}
                  href={`/notes/${folder}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <span className="text-xl">📁</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 capitalize">
                    {folder.replace(/-/g, ' ')}
                  </span>
                </Link>
              ))}
              {folders.length === 0 && (
                <p className="text-slate-500 text-sm px-3">No folders yet.</p>
              )}
            </div>
          </div>

          {/* Glossary Preview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Glossary</h2>
              <Link href="/keywords" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                All →
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map(kw => (
                <Link
                  key={kw.slug}
                  href={`/keywords/${kw.slug}`}
                  className="tag"
                >
                  {kw.frontmatter.title}
                </Link>
              ))}
              {keywords.length === 0 && (
                <p className="text-slate-500 text-sm">No keywords yet.</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="card">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Stats</h3>
            <dl className="space-y-2">
              {[
                { label: 'Posts', value: getAllBlogPosts().length },
                { label: 'Keywords', value: getAllKeywords().length },
                { label: 'Note Folders', value: folders.length },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
