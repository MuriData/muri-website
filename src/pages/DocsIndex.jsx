import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import manifest from 'virtual:content-manifest'
import Panel from '../components/Panel/Panel'
import Badge from '../components/Badge/Badge'
import Divider from '../components/Divider/Divider'
import './DocsIndex.css'

function DocsIndex() {
  return (
    <div className="docs-index">
      <Helmet>
        <title>Documentation — MuriData</title>
      </Helmet>
      <h1 className="docs-index__title">Documentation</h1>
      <p className="docs-index__desc">
        Learn how to use MuriData's decentralized storage marketplace, from getting started to deep architectural details.
      </p>
      <div className="docs-index__grid">
        {manifest.categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/docs/${cat.items[0]?.slug || ''}`}
            className="docs-index__card-link"
          >
            <Panel variant="surface" className="docs-index__card">
              <Badge variant="label">{cat.label}</Badge>
              <Divider tight />
              <p className="docs-index__card-desc">
                {cat.items.length} {cat.items.length === 1 ? 'article' : 'articles'}
              </p>
              <ul className="docs-index__card-list">
                {cat.items.map((item) => (
                  <li key={item.slug}>{item.title}</li>
                ))}
              </ul>
            </Panel>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default DocsIndex
