'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { RESTAURANT_ID } from '@/lib/restaurant'
import { getStoreStatus, StoreStatus } from '@/lib/storeHours'

// Shows a light red notice when the customer's chosen store is closed.
export default function StoreClosedBanner({ className = '' }: { className?: string }) {
  const [status, setStatus] = useState<StoreStatus | null>(null)
  const [name, setName] = useState('')

  useEffect(() => {
    const check = async () => {
      const id = localStorage.getItem('selectedLocationId')
      const locName = localStorage.getItem('selectedLocationName')
      if (!id && !locName) return
      const supabase = createClient()
      let q = supabase.from('locations').select('id, name, is_open, opening_hours').eq('restaurant_id', RESTAURANT_ID)
      q = id ? q.eq('id', id) : q.eq('name', locName!)
      const { data } = await q.maybeSingle()
      if (data) {
        setName(data.name)
        setStatus(getStoreStatus(data))
      }
    }
    check()
    const t = setInterval(check, 60000)
    return () => clearInterval(t)
  }, [])

  if (!status || status.open) return null

  return (
    <div className={`rounded-2xl p-4 flex items-start gap-3 ${className}`} style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
      <div className="text-xl">🕒</div>
      <div>
        <div className="font-semibold" style={{ color: '#991B1B' }}>{name || 'This store'} is closed</div>
        <div className="text-sm mt-0.5" style={{ color: '#B91C1C' }}>{status.message} You can still look at the menu.</div>
      </div>
    </div>
  )
}
