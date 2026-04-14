'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function OrderConfirmedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order') || ''
  const location = typeof window !== 'undefined' ? localStorage.getItem('selectedLocationName') || '' : ''
  const orderType = typeof window !== 'undefined' ? localStorage.getItem('orderType') || 'pickup' : 'pickup'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#FFFDF5' }}>
      <div className="text-center max-w-sm w-full">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
          style={{ backgroundColor: '#F5C800' }}>
          ✓
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Order Placed!</h1>
        <p className="text-lg font-semibold mb-1" style={{ color: '#F5C800' }}>{orderNumber}</p>
        <p className="text-sm mb-8" style={{ color: '#888' }}>
          {orderType === 'pickup' ? `Your order will be ready for pickup at ${location}` : `Your order is being prepared`}
        </p>

        <div className="rounded-2xl p-5 mb-6 bg-white text-left" style={{ border: '1px solid #e5e5e5' }}>
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: '#888' }}>Location</span>
            <span className="font-medium" style={{ color: '#1A1A1A' }}>{location}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: '#888' }}>Order Type</span>
            <span className="font-medium capitalize" style={{ color: '#1A1A1A' }}>{orderType}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: '#888' }}>Status</span>
            <span className="font-medium" style={{ color: '#22c55e' }}>Pending</span>
          </div>
        </div>

        <button onClick={() => router.push('/')}
          className="w-full py-4 rounded-2xl font-bold text-lg"
          style={{ backgroundColor: '#1A1A1A', color: '#fff' }}>
          Back to Home
        </button>
        <button onClick={() => router.push('/menu')}
          className="w-full py-3 rounded-2xl font-medium text-sm mt-3"
          style={{ border: '1px solid #e5e5e5', color: '#555' }}>
          Order More
        </button>
      </div>
    </div>
  )
}

export default function OrderConfirmedPage() {
  return (
    <Suspense>
      <OrderConfirmedContent />
    </Suspense>
  )
}
