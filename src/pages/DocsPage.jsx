import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useDocContent } from '../hooks/useContentLoader'
import MarkdownRenderer from '../components/MarkdownRenderer/MarkdownRenderer'
import TableOfContents from '../components/TableOfContents/TableOfContents'
import DocNav from '../components/DocNav/DocNav'
import './DocsPage.css'

function DocsPage() {
  const location = useLocation()
  const slug = location.pathname.replace('/docs/', '').replace(/\/$/, '')
  const { loading, content, frontmatter, headings } = useDocContent(slug)

  if (loading) {
    return <div className="docs-page__loading">Loading...</div>
  }

  if (!content) {
    return (
      <div className="docs-page__not-found">
        <h1>Page Not Found</h1>
        <p>The documentation page you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="docs-page">
      <Helmet>
        <title>{frontmatter?.title ? `${frontmatter.title} — MuriData Docs` : 'MuriData Docs'}</title>
        {frontmatter?.description && <meta name="description" content={frontmatter.description} />}
      </Helmet>
      <article className="docs-page__article">
        <MarkdownRenderer content={content} />
        <DocNav currentSlug={slug} />
      </article>
      <TableOfContents headings={headings} />
    </div>
  )
}

export default DocsPage
