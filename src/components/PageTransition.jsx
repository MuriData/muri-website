import { useRef, useEffect, useState } from 'react'

function PageTransition({ locationKey, className, children }) {
  const [displayChildren, setDisplayChildren] = useState(children)
  const [displayClassName, setDisplayClassName] = useState(className)
  const [transitioning, setTransitioning] = useState(false)
  const prevKey = useRef(locationKey)

  useEffect(() => {
    if (prevKey.current !== locationKey) {
      prevKey.current = locationKey
      setTransitioning(true)

      // Short fade-out, then swap content + className and fade-in
      const timeout = setTimeout(() => {
        setDisplayChildren(children)
        setDisplayClassName(className)
        setTransitioning(false)
        window.scrollTo(0, 0)
      }, 120)

      return () => clearTimeout(timeout)
    } else {
      setDisplayChildren(children)
      setDisplayClassName(className)
    }
  }, [locationKey, children, className])

  return (
    <div
      className={`page-transition${displayClassName ? ` ${displayClassName}` : ''}`}
      style={{
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? 'translateY(4px)' : 'translateY(0)',
        transition: 'opacity 150ms ease, transform 150ms ease',
      }}
    >
      {displayChildren}
    </div>
  )
}

export default PageTransition
