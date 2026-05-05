import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { RESTAURANT_ID } from '@/lib/restaurant'

interface RestaurantSettings {
  restaurant_name: string
  tagline: string
  primary_color: string
  logo_url: string
  phone: string
  email: string
  facebook: string
  instagram: string
  copyright: string
  footer_tagline: string
}

const defaultSettings: RestaurantSettings = {
  restaurant_name: "Angie's Kebabs & Burgers",
  tagline: 'Fresh & Delicious',
  primary_color: '#F5C800',
  logo_url: '',
  phone: '',
  email: '',
  facebook: '',
  instagram: '',
  copyright: "Angie's Kebabs & Burgers. All rights reserved.",
  footer_tagline: 'Fresh food, made with love.',
}

let cachedSettings: RestaurantSettings | null = null

export function useRestaurantSettings() {
  const [settings, setSettings] = useState<RestaurantSettings>(cachedSettings || defaultSettings)
  const [loading, setLoading] = useState(!cachedSettings)

  useEffect(() => {
    if (cachedSettings) return
    const supabase = createClient()
    supabase
      .from('site_settings')
      .select('key, value, type')
      .eq('restaurant_id', RESTAURANT_ID)
      .then(({ data }) => {
        if (!data) return
        const map: any = { ...defaultSettings }
        data.forEach((row: any) => {
          map[row.key] = row.value
        })
        cachedSettings = map
        setSettings(map)
        setLoading(false)
      })
  }, [])

  return { settings, loading }
}
