'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase'
import { RESTAURANT_ID } from '@/lib/restaurant'

export default function AboutPage() {
  const [content, setContent] = useState('')
  const [restaurantName, setRestaurantName] = useState("Angie's Kebabs & Burgers")
  const [locationCount, setLocationCount] = useState(0)
  const [menuCount, setMenuCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('settings').select('key, value').eq('restaurant_id', RESTAURANT_ID),
      supabase.from('locations').select('id', { count: 'exact', head: true }).eq('restaurant_id', RESTAURANT_ID).eq('is_active', true),
      supabase.from('menu_items').select('id', { count: 'exact', head: true }).eq('restaurant_id', RESTAURANT_ID).eq('available', true),
    ]).then(([settingsRes, locRes, menuRes]) => {
      const map: any = {}
      settingsRes.data?.forEach((r: any) => { map[r.key] = r.value })
      setContent(map.about_us_content || '')
      setRestaurantName(map.business_name || "Angie\'s Kebabs & Burgers")
      setLocationCount(locRes.count || 0)
      setMenuCount(menuRes.count || 0)
      setLoading(false)
    })
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <Navbar selectedLocation={null} onLocationClick={() => {}} />

      <section className="pt-32 pb-16 px-4 sm:px-6" style={{background: 'linear-gradient(135deg, #F5C800 0%, #F5C800cc 100%)'}}>
        <div className="max-w-3xl mx-auto text-center">
          <img src="/logo.jpg" alt={restaurantName} className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover mx-auto mb-6 shadow-lg" />
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4" style={{fontFamily: 'var(--font-display)'}}>
            About {restaurantName}
          </h1>
          <p className="text-gray-800 text-base sm:text-lg max-w-xl mx-auto">
            Fresh, handcrafted, halal. Made daily with love for our community.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" style={{fontFamily: 'var(--font-display)'}}>Our Story</h2>
            {loading ? (
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
              </div>
            ) : content ? (
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">{content}</div>
            ) : (
              <p className="text-gray-400">Content coming soon.</p>
            )}
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img src="/about-staff-kitchen.jpg" alt="Our team preparing fresh food" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6" style={{background: '#FFFDF0'}}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 text-center border border-yellow-100">
            <div className="text-3xl font-bold mb-1" style={{color: '#F5C800'}}>{loading ? '—' : locationCount}</div>
            <div className="text-sm text-gray-500">Locations</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center border border-yellow-100">
            <div className="text-3xl font-bold mb-1" style={{color: '#F5C800'}}>{loading ? '—' : `${menuCount}+`}</div>
            <div className="text-sm text-gray-500">Menu Items</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center border border-yellow-100">
            <div className="text-3xl font-bold mb-1" style={{color: '#F5C800'}}>100%</div>
            <div className="text-sm text-gray-500">Halal Certified</div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 flex items-start gap-4 border border-gray-100">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background: '#FFF3B0'}}>🚀</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Fast Pickup</h3>
              <p className="text-sm text-gray-500">Ready in 15-20 minutes. Skip the queue with online ordering.</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 flex items-start gap-4 border border-gray-100">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background: '#FFF3B0'}}>🌿</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Fresh Daily</h3>
              <p className="text-sm text-gray-500">Locally sourced produce and premium meats, prepared every day.</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 flex items-start gap-4 border border-gray-100">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background: '#FFF3B0'}}>📍</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Locally Sourced</h3>
              <p className="text-sm text-gray-500">Supporting our Melbourne community, one order at a time.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6" style={{background: '#FFFDF0'}}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8" style={{fontFamily: 'var(--font-display)'}}>Loved by Our Community</h2>
          <div className="rounded-2xl overflow-hidden shadow-lg max-w-2xl mx-auto">
            <img src="/about-customers.jpg" alt="Happy customers enjoying Angie's food" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" style={{fontFamily: 'var(--font-display)'}}>
          Ready to taste the difference?
        </h2>
        <Link href="/menu" className="inline-block mt-2 px-8 py-3 rounded-full font-semibold transition-all hover:shadow-lg hover:scale-105" style={{background: '#F5C800', color: '#1A1A1A'}}>
          Order Now
        </Link>
      </section>

      <Footer />
    </main>
  )
}
