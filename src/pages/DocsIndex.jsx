import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import manifest from 'virtual:content-manifest'
import './DocsIndex.css'

const CATEGORY_META = {
  'getting-started': {
    icon: '⚡',
    desc: 'Set up your environment and start using MuriData in minutes.',
  },
  architecture: {
    icon: '◇',
    desc: 'Understand the protocol design, smart contracts, and ZK proof system.',
  },
  legal: {
    icon: '§',
    desc: 'Terms of service, privacy policy, and cookie policy.',
  },
}

function DocsIndex() {
  const totalArticles = manifest.categories.reduce((sum, c) => sum + c.items.length, 0)

  return (
    <div className="docs-index">
      <Helmet>
        <title>Documentation — MuriData</title>
      </Helmet>

      <div className="docs-index__hero">
        <h1 className="docs-index__title">Documentation</h1>
        <p className="docs-index__desc">
          Everything you need to build on MuriData — from first steps to deep architectural details.
        </p>
        <div className="docs-index__stats">
          <span className="docs-index__stat">
            <strong>{manifest.categories.length}</strong> sections
          </span>
          <span className="docs-index__stat-dot" />
          <span className="docs-index__stat">
            <strong>{totalArticles}</strong> articles
          </span>
        </div>
      </div>

      <div className="docs-index__grid">
        {manifest.categories.map((cat) => {
          const meta = CATEGORY_META[cat.slug] || { icon: '◆', desc: '' }
          return (
            <div key={cat.slug} className="docs-index__card">
              <div className="docs-index__card-header">
                <span className="docs-index__card-icon">{meta.icon}</span>
                <h2 className="docs-index__card-title">{cat.label}</h2>
              </div>
              {meta.desc && (
                <p className="docs-index__card-desc">{meta.desc}</p>
              )}
              <ul className="docs-index__card-list">
                {cat.items.map((item) => (
                  <li key={item.slug}>
                    <Link to={`/docs/${item.slug}`} className="docs-index__article-link">
                      <span className="docs-index__article-arrow">→</span>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DocsIndex
