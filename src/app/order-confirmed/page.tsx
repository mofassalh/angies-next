'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase'
import { RESTAURANT_ID } from '@/lib/restaurant'

function OrderConfirmedContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order') || ''
  const orderId = searchParams.get('id') || ''
  const [orderType, setOrderType] = useState<string>('pickup')
  const [locationName, setLocationName] = useState<string>('')
  const [pointsEarned, setPointsEarned] = useState<number>(0)

  useEffect(() => {
    const savedType = localStorage.getItem('orderType')
    const savedLocation = localStorage.getItem('selectedLocationName')
    if (savedType) setOrderType(savedType)
    if (savedLocation) setLocationName(savedLocation)

    const addPoints = async () => {
      if (!orderId) return
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: existing } = await supabase
        .from('loyalty_points')
        .select('id')
        .eq('order_id', orderId)
        .single()
      if (existing) return

      const { data: order } = await supabase
        .from('orders')
        .select('total')
        .eq('id', orderId)
        .single()
      if (!order) return

      const { data: setting } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'points_per_dollar')
        .eq('restaurant_id', RESTAURANT_ID)
        .single()
      const ptsPerDollar = parseFloat(setting?.value || '1')
      const pts = Math.floor(order.total * ptsPerDollar)
      if (pts <= 0) return

      await supabase.from('loyalty_points').insert({
        user_id: user.id,
        order_id: orderId,
        points: pts,
        type: 'earn',
        description: `Order ${orderNumber} — earned ${pts} points`,
        restaurant_id: RESTAURANT_ID,
      })

      const { data: profile } = await supabase
        .from('profiles')
        .select('total_points')
        .eq('id', user.id)
        .single()
      const newTotal = (profile?.total_points || 0) + pts
      await supabase.from('profiles').upsert({ id: user.id, total_points: newTotal })

      setPointsEarned(pts)
    }

    addPoints()
  }, [orderId])

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

          {pointsEarned > 0 && (
            <div className="rounded-2xl p-4 mb-4 flex items-center gap-3"
              style={{ background: '#FFF9E0', border: '1px solid #E8C84A' }}>
              <span className="text-2xl">⭐</span>
              <div className="text-left">
                <div className="font-semibold text-sm" style={{ color: '#8A6800' }}>
                  You earned {pointsEarned} loyalty points!
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#B8960A' }}>
                  Keep ordering to unlock rewards
                </div>
              </div>
            </div>
          )}

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
            <Link href="/orders"
              className="w-full py-3 rounded-full text-white font-semibold block transition-all hover:shadow-lg"
              style={{background: 'var(--color-primary)'}}>
              Track My Order
            </Link>
            <Link href="/menu"
              className="w-full py-3 rounded-full font-semibold block border-2 transition-all hover:bg-yellow-50"
              style={{borderColor: 'var(--color-primary)', color: 'var(--color-primary)'}}>
              Order More
            </Link>
            <Link href="/"
              className="w-full py-3 rounded-full font-semibold block text-gray-400 hover:text-gray-600 transition-all">
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
