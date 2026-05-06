import { Metadata } from 'next'
import { getAllBlogPosts, getAllTags } from '@/lib/mdx'
import { BlogListClient } from './BlogListClient'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Financial analysis, quant research, AI/ML engineering, and technical notes.',
}

export default function BlogPage() {
  const posts = getAllBlogPosts()
  const tags = getAllTags()

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Blog</h1>
        <p className="text-slate-600 dark:text-slate-400">
          {posts.length} posts on finance, quant, AI/ML, and systems.
        </p>
      </div>
      <BlogListClient posts={posts} tags={tags} />
    </div>
  )
}
