'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { clsx } from 'clsx'

const nav = [
  { href: '/blog', label: 'Blog' },
  { href: '/keywords', label: 'Glossary' },
  { href: '/notes', label: 'Notes' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <span className="text-indigo-600 dark:text-indigo-400 font-mono text-lg">{'{ '}</span>
          <span>Harry&apos;s KB</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-mono text-lg">{' }'}</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                pathname.startsWith(href)
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Mobile nav */}
          <div className="sm:hidden flex gap-3">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'text-sm font-medium transition-colors',
                  pathname.startsWith(href)
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400'
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
