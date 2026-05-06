'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Fuse from 'fuse.js'
import { SearchBar } from '@/components/SearchBar'
import { clsx } from 'clsx'
import type { ContentItem } from '@/lib/mdx'

const CATEGORY_COLORS: Record<string, string> = {
  finance: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300',
  quant: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300',
  'machine-learning': 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300',
  systems: 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300',
  statistics: 'bg-pink-50 text-pink-700 dark:bg-pink-950/30 dark:text-pink-300',
  'software-engineering': 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300',
  'data-science': 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-300',
  general: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
}

export function KeywordsClient({ keywords, categories }: { keywords: ContentItem[]; categories: string[] }) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const fuse = useMemo(() => new Fuse(keywords, {
    keys: ['frontmatter.title', 'frontmatter.description'],
    threshold: 0.3,
  }), [keywords])

  const filtered = useMemo(() => {
    let result = query ? fuse.search(query).map(r => r.item) : keywords
    if (activeCategory) {
      result = result.filter(k => (k.frontmatter.category ?? 'general') === activeCategory)
    }
    return result
  }, [query, activeCategory, fuse, keywords])

  // Group alphabetically
  const grouped = useMemo(() => {
    const map = new Map<string, ContentItem[]>()
    filtered.forEach(kw => {
      const letter = kw.frontmatter.title[0].toUpperCase()
      if (!map.has(letter)) map.set(letter, [])
      map.get(letter)!.push(kw)
    })
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  return (
    <div className="space-y-6">
      <SearchBar value={query} onChange={setQuery} placeholder="Search terms..." />

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={clsx(
            'px-3 py-1 rounded-full text-xs font-medium transition-colors',
            activeCategory === null
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          )}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
            className={clsx(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize',
              activeCategory === cat
                ? 'bg-indigo-600 text-white'
                : CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.general
            )}
          >
            {cat.replace(/-/g, ' ')}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">{filtered.length} terms</p>

      {/* Grouped list */}
      <div className="space-y-8">
        {grouped.map(([letter, items]) => (
          <div key={letter}>
            <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-100 dark:border-slate-800 pb-1">
              {letter}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map(kw => (
                <Link key={kw.slug} href={`/keywords/${kw.slug}`} className="card group flex items-start gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {kw.frontmatter.title}
                      </span>
                      <span className={clsx(
                        'text-xs px-2 py-0.5 rounded-full capitalize',
                        CATEGORY_COLORS[kw.frontmatter.category ?? 'general'] ?? CATEGORY_COLORS.general
                      )}>
                        {(kw.frontmatter.category ?? 'general').replace(/-/g, ' ')}
                      </span>
                    </div>
                    {kw.frontmatter.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {kw.frontmatter.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
        {grouped.length === 0 && (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400">
            <p className="text-4xl mb-3">📖</p>
            <p>No terms found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
