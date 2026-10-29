'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import LocationPopup from '@/components/LocationPopup'
import { getStoreStatus, StoreStatus } from '@/lib/storeHours'

// Small client-side pieces used by the server-rendered store pages.

export function StoreNavbar() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [popup, setPopup] = useState(false)
  useEffect(() => {
    try { setSelected(localStorage.getItem('selectedLocationName')) } catch {}
  }, [])
  return (
    <>
      <Navbar selectedLocation={selected} onLocationClick={() => setPopup(true)} />
      {popup && (
        <LocationPopup
          onClose={() => setPopup(false)}
          onSelect={(id: string, name: string) => {
            try {
              localStorage.setItem('selectedLocationId', id)
              localStorage.setItem('selectedLocationName', name)
            } catch {}
            setSelected(name)
            setPopup(false)
            router.push('/menu')
          }}
        />
      )}
    </>
  )
}

export function OrderNowButton({ locationId, locationName, label = 'Order pickup now', variant = 'primary' }: {
  locationId: string
  locationName: string
  label?: string
  variant?: 'primary' | 'small'
}) {
  const router = useRouter()
  const go = () => {
    try {
      localStorage.setItem('selectedLocationId', locationId)
      localStorage.setItem('selectedLocationName', locationName)
    } catch {}
    router.push('/menu')
  }
  if (variant === 'small') {
    return (
      <button onClick={go} className="text-sm font-semibold underline underline-offset-4" style={{ color: '#1A1A1A' }}>
        {label}
      </button>
    )
  }
  return (
    <button onClick={go}
      className="inline-flex items-center justify-center rounded-full px-6 py-3 font-bold text-base transition hover:brightness-95"
      style={{ background: '#F5C800', color: '#1A1A1A' }}>
      {label}
    </button>
  )
}

// Live "Open now" / "Closed" badge — computed in the browser so it is always current.
export function OpenBadge({ location }: { location: { is_open?: boolean | null; opening_hours?: any } }) {
  const [status, setStatus] = useState<StoreStatus | null>(null)
  useEffect(() => {
    const tick = () => setStatus(getStoreStatus(location))
    tick()
    const t = setInterval(tick, 60000)
    return () => clearInterval(t)
  }, [location])
  if (!status) return <span className="inline-block h-7" />
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full"
      style={{ background: status.open ? '#F0FDF4' : '#FEF2F2', color: status.open ? '#15803D' : '#B91C1C' }}>
      <span className="w-2 h-2 rounded-full" style={{ background: status.open ? '#22C55E' : '#EF4444' }} />
      {status.open ? 'Open now' : status.message}
    </span>
  )
}
