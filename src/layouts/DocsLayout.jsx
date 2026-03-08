import { useState, useMemo } from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import manifest from 'virtual:content-manifest'
import Sidebar from '../components/Sidebar/Sidebar'
import './DocsLayout.css'

function DocsLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const currentSlug = location.pathname.replace('/docs/', '').replace(/\/$/, '')
  const { prev, next } = useMemo(() => {
    const allDocs = manifest.docs
    const idx = allDocs.findIndex((d) => d.slug === currentSlug)
    return {
      prev: idx > 0 ? allDocs[idx - 1] : null,
      next: idx >= 0 && idx < allDocs.length - 1 ? allDocs[idx + 1] : null,
    }
  }, [currentSlug])

  return (
    <div className="docs-layout">
      <div className="docs-layout__sidebar-col">
        <button
          className="docs-layout__sidebar-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Menu</span>
        </button>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="docs-layout__nav-bars">
          <div className="docs-layout__nav-bar">
            {prev ? (
              <Link to={`/docs/${prev.slug}`} className="docs-layout__nav-btn" aria-label="Previous article" title={prev.title}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ) : (
              <span className="docs-layout__nav-btn docs-layout__nav-btn--disabled" aria-disabled="true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
            <span className="docs-layout__nav-label">Article</span>
            {next ? (
              <Link to={`/docs/${next.slug}`} className="docs-layout__nav-btn" aria-label="Next article" title={next.title}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ) : (
              <span className="docs-layout__nav-btn docs-layout__nav-btn--disabled" aria-disabled="true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </div>
          <div className="docs-layout__nav-bar">
            <button className="docs-layout__nav-btn" onClick={() => navigate(-1)} aria-label="Go back" title="Back">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="docs-layout__nav-label">History</span>
            <button className="docs-layout__nav-btn" onClick={() => navigate(1)} aria-label="Go forward" title="Forward">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="docs-layout__content">
        <Outlet />
      </div>
    </div>
  )
}

export default DocsLayout
