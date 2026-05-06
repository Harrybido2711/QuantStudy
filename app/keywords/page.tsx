import { Metadata } from 'next'
import { getAllKeywords } from '@/lib/mdx'
import { KeywordsClient } from './KeywordsClient'

export const metadata: Metadata = {
  title: 'Glossary',
  description: 'Technical and financial terminology — finance, quant, ML, systems, and statistics.',
}

export default function KeywordsPage() {
  const keywords = getAllKeywords()
  const categories = Array.from(new Set(keywords.map(k => k.frontmatter.category ?? 'general'))).sort()

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Glossary</h1>
        <p className="text-slate-600 dark:text-slate-400">
          {keywords.length} terms across finance, quant, ML, and systems.
        </p>
      </div>
      <KeywordsClient keywords={keywords} categories={categories} />
    </div>
  )
}
