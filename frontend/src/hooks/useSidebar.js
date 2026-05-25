// src/hooks/useSidebar.js
import { useState, useEffect, useCallback } from 'react'

const SIDEBAR_KEY = 'agrovision_sidebar_open'

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(() => {
    // Desktop: default open; mobile: default closed
    if (typeof window === 'undefined') return true
    if (window.innerWidth < 768) return false
    const stored = localStorage.getItem(SIDEBAR_KEY)
    return stored !== null ? stored === 'true' : true
  })

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setIsOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen(prev => {
      const next = !prev
      if (!isMobile) localStorage.setItem(SIDEBAR_KEY, String(next))
      return next
    })
  }, [isMobile])

  const close = useCallback(() => setIsOpen(false), [])
  const open  = useCallback(() => setIsOpen(true),  [])

  return { isOpen, toggle, close, open, isMobile }
}
