'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase'
import { RESTAURANT_ID } from '@/lib/restaurant'

export default function AboutPage() {
  const [content, setContent] = useState('')
  const [restaurantName, setRestaurantName] = useState("Angie's Kebabs & Burgers")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('settings').select('key, value').eq('restaurant_id', RESTAURANT_ID).then(({ data }) => {
      const map: any = {}
      data?.forEach((r: any) => { map[r.key] = r.value })
      setContent(map.about_us_content || '')
      setRestaurantName(map.business_name || "Angie's Kebabs & Burgers")
      setLoading(false)
    })
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar selectedLocation={null} onLocationClick={() => {}} />
      <div className="pt-24 pb-16 max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8" style={{fontFamily: 'var(--font-display)'}}>
          About {restaurantName}
        </h1>
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
          </div>
        ) : content ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 text-gray-600 leading-relaxed whitespace-pre-line">
            {content}
          </div>
        ) : (
          <p className="text-gray-400">Content coming soon.</p>
        )}
      </div>
      <Footer />
    </main>
  )
}
