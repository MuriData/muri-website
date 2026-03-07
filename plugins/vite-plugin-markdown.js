import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const MD_RE = /\.md$/

function extractHeadings(content) {
  const headings = []
  const re = /^(#{1,6})\s+(.+)$/gm
  let match
  while ((match = re.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].replace(/[`*_~[\]]/g, '').trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    headings.push({ level, text, id })
  }
  return headings
}

function scanContentDir(contentDir) {
  const docs = []
  const blog = []

  function walkDocs(dir, pathParts = []) {
    if (!fs.existsSync(dir)) return
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    let category = null
    const catFile = path.join(dir, '_category.json')
    if (fs.existsSync(catFile)) {
      category = JSON.parse(fs.readFileSync(catFile, 'utf-8'))
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        walkDocs(path.join(dir, entry.name), [...pathParts, entry.name])
      } else if (entry.name.endsWith('.md')) {
        const filePath = path.join(dir, entry.name)
        const raw = fs.readFileSync(filePath, 'utf-8')
        const { data } = matter(raw)
        const slug = entry.name.replace(/\.md$/, '')
        docs.push({
          slug: [...pathParts, slug].join('/'),
          title: data.title || slug,
          description: data.description || '',
          order: data.order ?? 999,
          category: pathParts[pathParts.length - 1] || null,
          categoryLabel: category?.label || pathParts[pathParts.length - 1] || null,
          categoryOrder: category?.order ?? 999,
        })
      }
    }
  }

  function walkBlog(dir) {
    if (!fs.existsSync(dir)) return
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name.endsWith('.md')) {
        const filePath = path.join(dir, entry.name)
        const raw = fs.readFileSync(filePath, 'utf-8')
        const { data } = matter(raw)
        const slug = entry.name.replace(/\.md$/, '')
        blog.push({
          slug,
          title: data.title || slug,
          date: data.date || '',
          author: data.author || '',
          tags: data.tags || [],
          description: data.description || '',
        })
      }
    }
  }

  walkDocs(path.join(contentDir, 'docs'))
  walkBlog(path.join(contentDir, 'blog'))

  docs.sort((a, b) => {
    if (a.categoryOrder !== b.categoryOrder) return a.categoryOrder - b.categoryOrder
    return a.order - b.order
  })

  blog.sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  const categories = []
  const catMap = new Map()
  for (const doc of docs) {
    const key = doc.category || '__root'
    if (!catMap.has(key)) {
      catMap.set(key, {
        slug: doc.category,
        label: doc.categoryLabel || doc.category,
        order: doc.categoryOrder,
        items: [],
      })
      categories.push(catMap.get(key))
    }
    catMap.get(key).items.push(doc)
  }

  return { docs, blog, categories }
}

export default function markdownPlugin() {
  let contentDir

  return {
    name: 'vite-plugin-markdown',

    configResolved(config) {
      contentDir = path.resolve(config.root, 'content')
    },

    resolveId(id) {
      if (id === 'virtual:content-manifest') return '\0virtual:content-manifest'
      return null
    },

    load(id) {
      if (id === '\0virtual:content-manifest') {
        const manifest = scanContentDir(contentDir)
        return `export default ${JSON.stringify(manifest)}`
      }

      if (!MD_RE.test(id)) return null

      const raw = fs.readFileSync(id, 'utf-8')
      const { data, content } = matter(raw)
      const headings = extractHeadings(content)

      return `
        export const frontmatter = ${JSON.stringify(data)};
        export const content = ${JSON.stringify(content)};
        export const headings = ${JSON.stringify(headings)};
        export default { frontmatter, content, headings };
      `
    },

    configureServer(server) {
      server.watcher.add(contentDir)
      server.watcher.on('change', (file) => {
        if (file.startsWith(contentDir)) {
          const mod = server.moduleGraph.getModuleById('\0virtual:content-manifest')
          if (mod) server.moduleGraph.invalidateModule(mod)
          server.ws.send({ type: 'full-reload' })
        }
      })
    },

    handleHotUpdate({ file }) {
      if (file.startsWith(contentDir) && file.endsWith('.md')) {
        return []
      }
    },
  }
}
