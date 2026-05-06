'use client'

import { clsx } from 'clsx'

interface TagFilterProps {
  tags: string[]
  selected: string[]
  onToggle: (tag: string) => void
}

export function TagFilter({ tags, selected, onToggle }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onToggle(tag)}
          className={clsx(
            'px-3 py-1 rounded-full text-xs font-medium transition-colors',
            selected.includes(tag)
              ? 'bg-indigo-600 text-white dark:bg-indigo-500'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-700 dark:hover:text-indigo-300'
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
