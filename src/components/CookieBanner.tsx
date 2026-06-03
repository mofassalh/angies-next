'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4" style={{background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)'}}>
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-sm text-gray-300 flex-1">
          🍪 We use cookies to improve your experience, process orders, and analyze site usage.
          <Link href="/cookies" className="text-yellow-400 hover:underline ml-1">Learn more</Link>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button onClick={decline}
            className="px-4 py-2 rounded-full text-sm font-semibold text-gray-400 border border-gray-600 hover:border-gray-400 transition-colors">
            Decline
          </button>
          <button onClick={accept}
            className="px-6 py-2 rounded-full text-sm font-semibold text-gray-900 transition-all hover:opacity-90"
            style={{background:'#F5C800'}}>
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
