import { useScrollSpy } from '../../hooks/useScrollSpy'
import './TableOfContents.css'

function TableOfContents({ headings }) {
  const tocHeadings = (headings || []).filter((h) => h.level >= 2 && h.level <= 3)
  const headingIds = tocHeadings.map((h) => h.id)
  const activeId = useScrollSpy(headingIds)

  if (tocHeadings.length === 0) return null

  return (
    <aside className="toc">
      <div className="toc__header">On this page</div>
      <nav className="toc__nav">
        {tocHeadings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`toc__link toc__link--h${heading.level}${activeId === heading.id ? ' toc__link--active' : ''}`}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </aside>
  )
}

export default TableOfContents
