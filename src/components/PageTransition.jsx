import { useRef, useEffect, useState } from 'react'

function PageTransition({ locationKey, children }) {
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitioning, setTransitioning] = useState(false)
  const prevKey = useRef(locationKey)

  useEffect(() => {
    if (prevKey.current !== locationKey) {
      prevKey.current = locationKey
      setTransitioning(true)

      // Short fade-out, then swap content and fade-in
      const timeout = setTimeout(() => {
        setDisplayChildren(children)
        setTransitioning(false)
        window.scrollTo(0, 0)
      }, 120)

      return () => clearTimeout(timeout)
    } else {
      setDisplayChildren(children)
    }
  }, [locationKey, children])

  return (
    <div
      className="page-transition"
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
