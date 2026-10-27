'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { hasConsent, loadPixel, trackPageView } from '@/lib/metaPixel'

export default function MetaPixel({ pixelId }: { pixelId?: string }) {
  const pathname = usePathname()

  // Load when consent is already given, or as soon as the visitor accepts cookies
  useEffect(() => {
    if (!pixelId) return
    const start = () => { if (hasConsent()) { loadPixel(pixelId); trackPageView() } }
    start()
    window.addEventListener('cookie-consent', start)
    return () => window.removeEventListener('cookie-consent', start)
  }, [pixelId])

  // PageView on every client-side page change
  useEffect(() => {
    if (pixelId && hasConsent()) trackPageView()
  }, [pathname, pixelId])

  return null
}
