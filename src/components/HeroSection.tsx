'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { RESTAURANT_ID } from '@/lib/restaurant'

interface HeroProps {
  onOrderClick: () => void
}

export default function HeroSection({ onOrderClick }: HeroProps) {
  const [settings, setSettings] = useState<any>({})
  const [gallery, setGallery] = useState<any[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase.from('settings').select('*').eq('restaurant_id', RESTAURANT_ID).then(({ data }) => {
      const map: any = {}
      data?.forEach((r: any) => { map[r.key] = r.value })
      setSettings(map)
    })
    supabase.from('gallery').select('*').eq('restaurant_id', RESTAURANT_ID).limit(4).then(({ data }) => {
      if (data && data.length > 0) setGallery(data)
    })
  }, [])

  const businessName = settings.business_name || 'Our Restaurant'
  const tagline = settings.tagline || 'Order online for pickup or delivery'
  const badge = settings.hero_badge || ''
  const heroTitle1 = settings.hero_title1 || 'Fresh &'
  const heroTitle2 = settings.hero_title2 || 'Flavourful'
  const heroTitle3 = settings.hero_title3 || 'Every Time'
  const primaryColor = settings.primary_color || '#F5C800'
  const locationCount = settings.location_count || '1'
  const menuItemCount = settings.menu_item_count || '50+'
  const rating = settings.hero_rating || '4.8★'
  const popularItem = settings.popular_item || 'Our Best Seller'

  const images = gallery.length >= 4
    ? gallery.map((g: any) => g.image_url)
    : [
        settings.hero_image1 || '',
        settings.hero_image2 || '',
        settings.hero_image3 || '',
        settings.hero_image4 || '',
      ]

  return (
    <section className="pt-16 flex items-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FFFDF0 0%, #FFF9D6 50%, #FFFEF5 100%)' }}>

      <div className="absolute top-20 right-0 w-96 h-96 rounded-full opacity-20"
        style={{ background: primaryColor, filter: 'blur(80px)' }} />
      <div className="absolute bottom-20 left-0 w-64 h-64 rounded-full opacity-10"
        style={{ background: primaryColor, filter: 'blur(60px)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — Text */}
          <div>
            {badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{ background: '#FFF3B0', color: '#1A1A1A' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: primaryColor }}></span>
                {badge}
              </div>
            )}

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ fontFamily: 'var(--font-display)', color: '#1A1A1A' }}>
              {heroTitle1}{' '}
              <span style={{ color: '#D4A900' }}>{heroTitle2}</span>
              <br />
              {heroTitle3}
            </h1>

            <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-md">
              {tagline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={onOrderClick}
                className="px-8 py-4 rounded-full font-semibold text-base transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                style={{ background: primaryColor, color: '#1A1A1A' }}>
                Order Now
              </button>
              <button onClick={onOrderClick}
                className="px-8 py-4 rounded-full font-semibold text-base border-2 transition-all hover:bg-yellow-50"
                style={{ borderColor: primaryColor, color: '#1A1A1A' }}>
                View Menu
              </button>
            </div>

            <div className="flex gap-8 mt-12 pt-8 border-t border-yellow-100">
              <div>
                <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{locationCount}</div>
                <div className="text-sm text-gray-500">Locations</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{menuItemCount}</div>
                <div className="text-sm text-gray-500">Menu Items</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{rating}</div>
                <div className="text-sm text-gray-500">Rating</div>
              </div>
            </div>
          </div>

          {/* Right — Food Collage */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-72 h-72 lg:w-96 lg:h-96">
              <div className="absolute inset-0 rounded-full"
                style={{ background: 'linear-gradient(135deg, #FFF3B0, #FFE566)' }} />

              {images[0] && (
                <div className="absolute inset-4 rounded-full overflow-hidden shadow-2xl">
                  <img src={images[0]} alt="food" className="w-full h-full object-cover" />
                </div>
              )}
              {images[1] && (
                <div className="absolute -top-2 -right-2 w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                  <img src={images[1]} alt="food" className="w-full h-full object-cover" />
                </div>
              )}
              {images[2] && (
                <div className="absolute -bottom-2 -left-2 w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                  <img src={images[2]} alt="food" className="w-full h-full object-cover" />
                </div>
              )}
              {images[3] && (
                <div className="absolute -bottom-4 right-8 w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                  <img src={images[3]} alt="food" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="absolute -top-4 left-4 bg-white rounded-2xl shadow-lg px-3 py-2 flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <div>
                  <div className="text-xs font-bold text-gray-800">Most Popular</div>
                  <div className="text-xs text-gray-400">{popularItem}</div>
                </div>
              </div>

              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg px-3 py-2 flex items-center gap-2 whitespace-nowrap">
                <span className="text-xl">⭐</span>
                <div>
                  <div className="text-xs font-bold text-gray-800">{rating} Rating</div>
                  <div className="text-xs text-gray-400">500+ reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
