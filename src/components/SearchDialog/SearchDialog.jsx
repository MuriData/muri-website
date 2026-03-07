import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchClient, indexName } from '../../lib/algolia'
import './SearchDialog.css'

function SearchDialog({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const navigate = useNavigate()

  const handleClose = useCallback(() => {
    setQuery('')
    setResults([])
    onClose()
  }, [onClose])

  const search = useCallback(async (q) => {
    if (!q || !searchClient) {
      setResults([])
      return
    }
    try {
      const { results: searchResults } = await searchClient.search([
        { indexName, query: q, params: { hitsPerPage: 8 } },
      ])
      setResults(searchResults[0]?.hits || [])
    } catch {
      setResults([])
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => search(query), 200)
    return () => clearTimeout(timer)
  }, [query, search])

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) handleClose()
      }
      if (e.key === 'Escape' && isOpen) handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  if (!isOpen) return null

  const handleSelect = (hit) => {
    const path = hit.url || hit.slug || '/'
    navigate(path)
    handleClose()
  }

  const noAlgolia = !searchClient

  return (
    <div className="search-overlay" onClick={handleClose}>
      <div className="search-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="search-dialog__input-wrap">
          <svg className="search-dialog__icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="2" />
            <path d="M12 12l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            className="search-dialog__input"
            type="text"
            placeholder={noAlgolia ? 'Search (configure Algolia to enable)' : 'Search documentation...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={noAlgolia}
            autoFocus
          />
          <button className="search-dialog__close" onClick={handleClose} aria-label="Close search">
            <kbd>ESC</kbd>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1 1l8 8M9 1L1 9" />
            </svg>
          </button>
        </div>
        {results.length > 0 && (
          <ul className="search-dialog__results">
            {results.map((hit) => (
              <li key={hit.objectID}>
                <button className="search-dialog__result" onClick={() => handleSelect(hit)}>
                  <span className="search-dialog__result-title">{hit.title}</span>
                  {hit.description && (
                    <span className="search-dialog__result-desc">{hit.description}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
        {query && results.length === 0 && !noAlgolia && (
          <div className="search-dialog__empty">No results found for &ldquo;{query}&rdquo;</div>
        )}
        {noAlgolia && (
          <div className="search-dialog__empty">
            Set VITE_ALGOLIA_APP_ID and VITE_ALGOLIA_SEARCH_KEY in .env to enable search.
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchDialog
