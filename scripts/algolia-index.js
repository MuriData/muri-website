import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { algoliasearch } from 'algoliasearch'

const appId = process.env.ALGOLIA_APP_ID || process.env.VITE_ALGOLIA_APP_ID
const adminKey = process.env.ALGOLIA_ADMIN_KEY
const indexName = process.env.VITE_ALGOLIA_INDEX_NAME || 'muridata'

if (!appId || !adminKey) {
  console.error('Missing ALGOLIA_APP_ID or ALGOLIA_ADMIN_KEY environment variables')
  process.exit(1)
}

const client = algoliasearch(appId, adminKey)
const contentDir = path.resolve(import.meta.dirname, '..', 'content')

function collectRecords() {
  const records = []

  function walk(dir, type, slugBase) {
    if (!fs.existsSync(dir)) return
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), type, `${slugBase}/${entry.name}`)
      } else if (entry.name.endsWith('.md')) {
        const filePath = path.join(dir, entry.name)
        const raw = fs.readFileSync(filePath, 'utf-8')
        const { data, content } = matter(raw)
        const slug = entry.name.replace(/\.md$/, '')
        const url = `/${type}/${slugBase ? slugBase + '/' : ''}${slug}`.replace(/\/+/g, '/')
        records.push({
          objectID: url,
          title: data.title || slug,
          description: data.description || '',
          content: content.slice(0, 5000),
          url,
          type,
          date: data.date || null,
          tags: data.tags || [],
        })
      }
    }
  }

  walk(path.join(contentDir, 'docs'), 'docs', '')
  walk(path.join(contentDir, 'blog'), 'blog', '')

  return records
}

async function main() {
  const records = collectRecords()
  console.log(`Indexing ${records.length} records to Algolia index "${indexName}"...`)

  await client.saveObjects({ indexName, objects: records })
  console.log('Done!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
