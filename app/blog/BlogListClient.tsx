'use client'

import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import { SearchBar } from '@/components/SearchBar'
import { TagFilter } from '@/components/TagFilter'
import { BlogCard } from '@/components/BlogCard'
import type { ContentItem } from '@/lib/mdx'

export function BlogListClient({ posts, tags }: { posts: ContentItem[]; tags: string[] }) {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const fuse = useMemo(() => new Fuse(posts, {
    keys: ['frontmatter.title', 'frontmatter.description', 'frontmatter.tags'],
    threshold: 0.3,
  }), [posts])

  const filtered = useMemo(() => {
    let result = query ? fuse.search(query).map(r => r.item) : posts
    if (selectedTags.length > 0) {
      result = result.filter(p =>
        selectedTags.every(t => p.frontmatter.tags?.includes(t))
      )
    }
    return result
  }, [query, selectedTags, fuse, posts])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div className="space-y-6">
      <SearchBar value={query} onChange={setQuery} placeholder="Search posts..." />
      <TagFilter tags={tags} selected={selectedTags} onToggle={toggleTag} />

      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>{filtered.length} {filtered.length === 1 ? 'post' : 'posts'}</span>
        {selectedTags.length > 0 && (
          <button onClick={() => setSelectedTags([])} className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Clear filters
          </button>
        )}
      </div>

      <div className="space-y-4">
        {filtered.map(post => (
          <BlogCard key={post.slug} post={post} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400">
            <p className="text-4xl mb-3">🔍</p>
            <p>No posts found. Try different keywords or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
