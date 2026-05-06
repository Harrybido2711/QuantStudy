import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

export interface Frontmatter {
  title: string
  date: string
  tags: string[]
  description?: string
  image?: string
  category?: string
  relatedTerms?: string[]
  references?: string[]
}

export interface ContentItem {
  slug: string
  frontmatter: Frontmatter
  readingTime: string
  folder?: string
}

const contentRoot = path.join(process.cwd(), 'content')

function getFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries
    .filter(e => e.isFile() && (e.name.endsWith('.mdx') || e.name.endsWith('.md')))
    .map(e => e.name)
}

function getFolders(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries.filter(e => e.isDirectory()).map(e => e.name)
}

// ── Blog ──────────────────────────────────────────────────────────────────────

export function getAllBlogSlugs(): string[] {
  return getFiles(path.join(contentRoot, 'blog')).map(f => f.replace(/\.mdx?$/, ''))
}

export function getBlogPost(slug: string) {
  const filePath = path.join(contentRoot, 'blog', `${slug}.mdx`)
  const fallback = path.join(contentRoot, 'blog', `${slug}.md`)
  const raw = fs.readFileSync(fs.existsSync(filePath) ? filePath : fallback, 'utf-8')
  const { data, content } = matter(raw)
  return {
    frontmatter: data as Frontmatter,
    content,
    readingTime: readingTime(content).text,
  }
}

export function getAllBlogPosts(): ContentItem[] {
  return getAllBlogSlugs()
    .map(slug => {
      const { frontmatter, content } = getBlogPost(slug)
      return { slug, frontmatter, readingTime: readingTime(content).text }
    })
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
}

// ── Keywords ──────────────────────────────────────────────────────────────────

export function getAllKeywordSlugs(): string[] {
  return getFiles(path.join(contentRoot, 'keywords')).map(f => f.replace(/\.mdx?$/, ''))
}

export function getKeyword(slug: string) {
  const filePath = path.join(contentRoot, 'keywords', `${slug}.mdx`)
  const fallback = path.join(contentRoot, 'keywords', `${slug}.md`)
  const raw = fs.readFileSync(fs.existsSync(filePath) ? filePath : fallback, 'utf-8')
  const { data, content } = matter(raw)
  return { frontmatter: data as Frontmatter, content }
}

export function getAllKeywords(): ContentItem[] {
  return getAllKeywordSlugs()
    .map(slug => {
      const { frontmatter, content } = getKeyword(slug)
      return { slug, frontmatter, readingTime: readingTime(content).text }
    })
    .sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title))
}

// ── Notes ─────────────────────────────────────────────────────────────────────

export function getAllNoteFolders(): string[] {
  return getFolders(path.join(contentRoot, 'notes'))
}

export function getNoteSlugsByFolder(folder: string): string[] {
  return getFiles(path.join(contentRoot, 'notes', folder)).map(f => f.replace(/\.mdx?$/, ''))
}

export function getNote(folder: string, slug: string) {
  const filePath = path.join(contentRoot, 'notes', folder, `${slug}.mdx`)
  const fallback = path.join(contentRoot, 'notes', folder, `${slug}.md`)
  const raw = fs.readFileSync(fs.existsSync(filePath) ? filePath : fallback, 'utf-8')
  const { data, content } = matter(raw)
  return {
    frontmatter: data as Frontmatter,
    content,
    readingTime: readingTime(content).text,
  }
}

export function getAllNotes(): ContentItem[] {
  return getAllNoteFolders().flatMap(folder =>
    getNoteSlugsByFolder(folder).map(slug => {
      const { frontmatter, content } = getNote(folder, slug)
      return { slug, folder, frontmatter, readingTime: readingTime(content).text }
    })
  )
}

// ── Shared ────────────────────────────────────────────────────────────────────

export function getAllTags(): string[] {
  const posts = getAllBlogPosts()
  const tags = new Set<string>()
  posts.forEach(p => p.frontmatter.tags?.forEach(t => tags.add(t)))
  return Array.from(tags).sort()
}
