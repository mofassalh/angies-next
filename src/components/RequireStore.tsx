'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { RESTAURANT_ID } from '@/lib/restaurant'
import LocationPopup from '@/components/LocationPopup'

// Makes sure a store is picked before ordering. Customers who already chose a store
// never see this again; it only opens when nothing (or an old/inactive store) is saved,
// e.g. someone who came straight to /menu or /checkout from a link.
export default function RequireStore({
  required = false,
  open: openProp,
  onChosen,
  onClose,
}: {
  required?: boolean // checkout: can't be closed without choosing
  open?: boolean // force open (e.g. "change store" click)
  onChosen?: (id: string, name: string) => void
  onClose?: () => void
}) {
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    const check = async () => {
      const id = localStorage.getItem('selectedLocationId')
      const supabase = createClient()
      const { data } = await supabase
        .from('locations')
        .select('id, name')
        .eq('restaurant_id', RESTAURANT_ID)
        .eq('is_active', true)
      const active = data || []
      if (id && active.some(l => l.id === id)) return
      if (active.length === 1) {
        save(active[0].id, active[0].name)
        return
      }
      setMissing(true)
    }
    check()
  }, [])

  const save = (id: string, name: string) => {
    localStorage.setItem('selectedLocationId', id)
    localStorage.setItem('selectedLocationName', name)
    window.dispatchEvent(new Event('storage'))
    setMissing(false)
    onChosen?.(id, name)
  }

  if (!missing && !openProp) return null

  return (
    <LocationPopup
      onSelect={(id: string, name: string) => save(id, name)}
      onClose={() => {
        if (required && missing) return // checkout needs a store
        setMissing(false)
        onClose?.()
      }}
    />
  )
}
