'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function DeliveryPage() {
  const router = useRouter()
  const [location, setLocation] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('selectedLocationName')
    if (saved) setLocation(saved)
  }, [])

  const handleOrderDelivery = () => {
    localStorage.setItem('orderType', 'delivery')
    router.push('/menu')
  }

  const handleOrderPickup = () => {
    localStorage.setItem('orderType', 'pickup')
    router.push('/menu')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar selectedLocation={location || null} onLocationClick={() => {}} />
      <div className="pt-16 max-w-md mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{fontFamily: 'var(--font-display)'}}>
          How would you like your order?
        </h1>
        <p className="text-gray-500 mb-8">Choose how you'd like to receive your order</p>

        <div className="space-y-3">
          {/* Delivery option */}
          <button onClick={handleOrderDelivery}
            className="flex items-center justify-between w-full p-5 bg-white rounded-2xl border-2 transition-all hover:shadow-md hover:-translate-y-0.5"
            style={{ borderColor: 'var(--color-primary)' }}>
            <div className="flex items-center gap-4">
              <span className="text-3xl">🛵</span>
              <div className="text-left">
                <div className="font-bold text-lg text-gray-900">Delivery</div>
                <div className="text-sm text-gray-500">30-45 mins · $5.00 delivery fee</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Pickup option */}
          <button onClick={handleOrderPickup}
            className="flex items-center justify-between w-full p-5 bg-white rounded-2xl border border-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
              <span className="text-3xl">🏃</span>
              <div className="text-left">
                <div className="font-bold text-lg text-gray-900">Pickup</div>
                <div className="text-sm text-gray-500">15-20 mins · Free</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {location && (
          <div className="mt-6 p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-3">
            <span className="text-xl">📍</span>
            <div>
              <div className="text-xs text-gray-400">Selected Location</div>
              <div className="font-semibold text-sm text-gray-900">{location}</div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
