import { useEffect, useRef } from 'react'

export function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin: '0px 0px -20px 0px' },
    )

    const targets = el.querySelectorAll('.reveal')
    targets.forEach((target, i) => {
      ;(target as HTMLElement).style.transitionDelay = `${i * 0.06}s`
      observer.observe(target)
    })

    return () => observer.disconnect()
  }, [threshold])

  return ref
}
