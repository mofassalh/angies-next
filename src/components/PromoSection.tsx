'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

interface PromoProps {
  onOrderClick: () => void
}

export default function PromoSection({ onOrderClick }: PromoProps) {
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('settings').select('*').then(({ data }) => {
      const map: any = {}
      data?.forEach((r: any) => { map[r.key] = r.value })
      setSettings(map)
    })
  }, [])

  // promo_enabled false হলে hide
  if (settings && settings.promo_enabled === 'false') return null

  const title = settings?.promo_title || 'Free Delivery on Your First Order!'
  const subtitle = settings?.promo_subtitle || 'Sign up today and enjoy free delivery on your first order. Available at all 3 Melbourne locations.'
  const buttonText = settings?.promo_button_text || 'Order Now & Save'
  const buttonLink = settings?.promo_button_link || null
  const emoji = settings?.promo_emoji || '🎁'
  const bgColor = settings?.primary_color || '#F5C800'

  const handleClick = () => {
    if (buttonLink) window.location.href = buttonLink
    else onOrderClick()
  }

  return (
    <section className="py-20" style={{background: '#FFFDF0'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden"
          style={{background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}cc 100%)`}}
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{background: 'white', transform: 'translate(30%, -30%)'}}></div>
          <div className="absolute bottom-0 left-20 w-40 h-40 rounded-full opacity-10" style={{background: 'white', transform: 'translateY(30%)'}}></div>
          <div className="relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-black bg-opacity-10 px-3 py-1.5 rounded-full text-black text-xs font-semibold mb-4">
              🎉 Limited Time Offer
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3" style={{fontFamily: 'var(--font-display)'}}>
              {title.includes('\n') ? title.split('\n').map((line: string, i: number) => (
                <span key={i}>{line}{i < title.split('\n').length - 1 && <br />}</span>
              )) : title}
            </h2>
            <p className="text-gray-800 mb-6 max-w-md">{subtitle}</p>
            <button
              onClick={handleClick}
              className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-full transition-all hover:shadow-lg hover:scale-105"
            >
              {buttonText}
            </button>
          </div>
          <div className="relative z-10 text-8xl lg:text-9xl">{emoji}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl p-6 flex items-start gap-4 border border-yellow-100">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background: '#FFF3B0'}}>🚀</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Fast Pickup</h3>
              <p className="text-sm text-gray-500">Ready in 15-20 minutes. Skip the queue with online ordering.</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 flex items-start gap-4 border border-yellow-100">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background: '#FFF3B0'}}>🌿</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Fresh Ingredients</h3>
              <p className="text-sm text-gray-500">Locally sourced produce and premium meats, prepared daily.</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 flex items-start gap-4 border border-yellow-100">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background: '#FFF3B0'}}>📍</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">3 Locations</h3>
              <p className="text-sm text-gray-500">St Albans, Fitzroy North & Ascot Vale. Always nearby.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
