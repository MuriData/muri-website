import { useState, useEffect, useMemo } from 'react'

const docModules = import.meta.glob('/content/docs/**/*.md')
const blogModules = import.meta.glob('/content/blog/**/*.md')

function loadModule(modules, pathPrefix, slug) {
  const key = `${pathPrefix}${slug}.md`
  const loader = modules[key]
  if (!loader) {
    return Promise.resolve({ slug, content: null, frontmatter: null, headings: [] })
  }
  return loader().then((mod) => ({
    slug,
    content: mod.content,
    frontmatter: mod.frontmatter,
    headings: mod.headings || [],
  }))
}

function useModuleContent(modules, pathPrefix, slug) {
  const [loaded, setLoaded] = useState({ slug: null, content: null, frontmatter: null, headings: [] })

  useEffect(() => {
    if (!slug) return

    let cancelled = false
    loadModule(modules, pathPrefix, slug).then((result) => {
      if (!cancelled) setLoaded(result)
    })

    return () => { cancelled = true }
  }, [slug, modules, pathPrefix])

  const loading = Boolean(slug && slug !== loaded.slug)

  return useMemo(() => ({
    loading,
    content: loading ? null : loaded.content,
    frontmatter: loading ? null : loaded.frontmatter,
    headings: loading ? [] : loaded.headings,
  }), [loading, loaded])
}

export function useDocContent(slug) {
  return useModuleContent(docModules, '/content/docs/', slug)
}

export function useBlogContent(slug) {
  return useModuleContent(blogModules, '/content/blog/', slug)
}
