import { useState, useEffect } from 'react'

export function useScrollSpy(headingIds) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (!headingIds || headingIds.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    )

    const elements = headingIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [headingIds])

  return activeId
}
