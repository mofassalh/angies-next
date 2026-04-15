'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

function OrderConfirmedContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order') || ''
  const [orderType, setOrderType] = useState<string>('pickup')
  const [locationName, setLocationName] = useState<string>('')

  useEffect(() => {
    const savedType = localStorage.getItem('orderType')
    const savedLocation = localStorage.getItem('selectedLocationName')
    if (savedType) setOrderType(savedType)
    if (savedLocation) setLocationName(savedLocation)
  }, [])

  const estTime = orderType === 'delivery' ? '30-45 minutes' : '15-20 minutes'
  const typeLabel = orderType === 'delivery' ? '🛵 Delivery' : '🏃 Pickup'

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar selectedLocation={null} onLocationClick={() => {}} />
      <div className="pt-16 flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6" style={{background: '#D1FAE5'}}>
            ✅
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{fontFamily: 'var(--font-display)'}}>
            Order Placed!
          </h1>
          <p className="text-gray-500 mb-6">
            Thank you! We'll start preparing your order right away.
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-3">
            {orderNumber && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order Number</span>
                <span className="font-bold text-gray-900">{orderNumber}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="font-semibold text-green-600">Confirmed ✓</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Type</span>
              <span className="font-semibold text-gray-900">{typeLabel}</span>
            </div>
            {locationName && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Location</span>
                <span className="font-semibold text-gray-900">{locationName}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Est. Time</span>
              <span className="font-semibold text-gray-900">{estTime}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/orders"
              className="w-full py-3 rounded-full text-white font-semibold block transition-all hover:shadow-lg"
              style={{background: 'var(--color-primary)'}}
            >
              Track My Order
            </Link>
            <Link
              href="/menu"
              className="w-full py-3 rounded-full font-semibold block border-2 transition-all hover:bg-orange-50"
              style={{borderColor: 'var(--color-primary)', color: 'var(--color-primary)'}}
            >
              Order More
            </Link>
            <Link
              href="/"
              className="w-full py-3 rounded-full font-semibold block text-gray-400 hover:text-gray-600 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OrderConfirmedContent />
    </Suspense>
  )
}
