'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function OrderConfirmedPage() {
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
            Thank you for your order. We'll start preparing it right away!
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="font-semibold text-green-600">Confirmed ✓</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Est. Time</span>
              <span className="font-semibold text-gray-900">15-20 minutes</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/menu"
              className="w-full py-3 rounded-full text-white font-semibold block transition-all hover:shadow-lg"
              style={{background: 'var(--color-primary)'}}
            >
              Order More
            </Link>
            <Link
              href="/"
              className="w-full py-3 rounded-full font-semibold block border-2 transition-all hover:bg-orange-50"
              style={{borderColor: 'var(--color-primary)', color: 'var(--color-primary)'}}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
