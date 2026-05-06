export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-500">
        <p>© {new Date().getFullYear()} Harry Chen · Personal Knowledge Hub</p>
        <div className="flex items-center gap-4">
          <a href="https://github.com" className="hover:text-slate-900 dark:hover:text-white transition-colors">GitHub</a>
          <a href="/blog" className="hover:text-slate-900 dark:hover:text-white transition-colors">Blog</a>
          <a href="/keywords" className="hover:text-slate-900 dark:hover:text-white transition-colors">Glossary</a>
        </div>
      </div>
    </footer>
  )
}
