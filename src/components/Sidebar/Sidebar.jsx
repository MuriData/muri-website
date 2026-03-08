import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import manifest from 'virtual:content-manifest'
import './Sidebar.css'

function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const currentSlug = location.pathname.replace('/docs/', '').replace(/\/$/, '')

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <span className="sidebar__title">Documentation</span>
          <button className="sidebar__close" onClick={onClose} aria-label="Close sidebar">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="sidebar__nav">
          {manifest.categories.map((cat) => (
            <SidebarCategory key={cat.slug} category={cat} currentSlug={currentSlug} />
          ))}
        </nav>
      </aside>
    </>
  )
}

function SidebarCategory({ category, currentSlug }) {
  const hasActive = category.items.some((item) => item.slug === currentSlug)
  const [expanded, setExpanded] = useState(hasActive)

  useEffect(() => {
    if (hasActive) setExpanded(true)
  }, [hasActive])

  return (
    <div className="sidebar__category">
      <button
        className={`sidebar__category-btn${expanded ? ' sidebar__category-btn--expanded' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <svg
          className="sidebar__chevron"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M4 3l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {category.label}
      </button>
      {expanded && (
        <ul className="sidebar__items">
          {category.items.map((item) => (
            <li key={item.slug}>
              <Link
                to={`/docs/${item.slug}`}
                className={`sidebar__link${item.slug === currentSlug ? ' sidebar__link--active' : ''}`}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Sidebar
