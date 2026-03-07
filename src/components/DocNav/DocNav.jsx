import { Link } from 'react-router-dom'
import manifest from 'virtual:content-manifest'
import './DocNav.css'

function DocNav({ currentSlug }) {
  const allDocs = manifest.docs
  const currentIndex = allDocs.findIndex((d) => d.slug === currentSlug)

  if (currentIndex === -1) return null

  const prev = currentIndex > 0 ? allDocs[currentIndex - 1] : null
  const next = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null

  if (!prev && !next) return null

  return (
    <nav className="doc-nav">
      {prev ? (
        <Link to={`/docs/${prev.slug}`} className="doc-nav__link doc-nav__link--prev">
          <span className="doc-nav__label">Previous</span>
          <span className="doc-nav__title">{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link to={`/docs/${next.slug}`} className="doc-nav__link doc-nav__link--next">
          <span className="doc-nav__label">Next</span>
          <span className="doc-nav__title">{next.title}</span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}

export default DocNav
