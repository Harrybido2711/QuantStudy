'use client'

import { useEffect, useState } from 'react'
import { clsx } from 'clsx'

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const els = Array.from(document.querySelectorAll('article h2, article h3, article h4'))
    setHeadings(els.map(el => ({
      id: el.id,
      text: el.textContent ?? '',
      level: parseInt(el.tagName[1]),
    })))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.find(e => e.isIntersecting)
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    document.querySelectorAll('article h2, article h3, article h4').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  return (
    <nav className="sticky top-24 text-sm">
      <p className="font-semibold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
        On this page
      </p>
      <ul className="space-y-1.5 border-l border-slate-200 dark:border-slate-700">
        {headings.map(h => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={clsx(
                'block py-0.5 pl-3 -ml-px border-l transition-colors text-xs leading-relaxed',
                h.level === 3 && 'pl-6',
                h.level === 4 && 'pl-9',
                active === h.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-medium'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
