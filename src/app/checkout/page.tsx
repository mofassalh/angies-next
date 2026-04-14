'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', phone: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const location = typeof window !== 'undefined' ? localStorage.getItem('selectedLocationName') || '' : ''
  const orderType = typeof window !== 'undefined' ? localStorage.getItem('orderType') || 'pickup' : 'pickup'

  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) setCart(JSON.parse(saved))
  }, [])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = async () => {
    if (!form.name || !form.phone) { setError('Please fill in your name and phone'); return }
    setLoading(true)
    setError('')

    const orderNumber = `#${Math.floor(10000 + Math.random() * 90000)}`

    const { error: err } = await supabase.from('orders').insert({
      order_number: orderNumber,
      customer_name: form.name,
      customer_phone: form.phone,
      order_type: orderType,
      location: location,
      items: cart,
      total: total,
      status: 'pending',
      notes: form.notes,
    })

    if (err) { setError('Something went wrong. Please try again.'); setLoading(false); return }

    localStorage.removeItem('cart')
    router.push(`/order-confirmed?order=${orderNumber}`)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFDF5' }}>
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} style={{ color: '#888' }}>← Back</button>
        <h1 className="font-bold" style={{ color: '#1A1A1A' }}>Checkout</h1>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Order Summary */}
        <div className="rounded-2xl p-5 mb-4 bg-white" style={{ border: '1px solid #e5e5e5' }}>
          <h3 className="font-bold mb-4" style={{ color: '#1A1A1A' }}>Order Summary</h3>
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between text-sm py-2" style={{ borderBottom: '1px solid #f5f5f5' }}>
              <div>
                <span style={{ color: '#1A1A1A' }}>{item.name} x{item.quantity}</span>
                {Object.entries(item.selectedOptions || {}).map(([k, v]: any) => (
                  <p key={k} className="text-xs" style={{ color: '#aaa' }}>
                    {k}: {Array.isArray(v) ? v.map((o: any) => o.name).join(', ') : v?.name}
                  </p>
                ))}
              </div>
              <span className="font-semibold" style={{ color: '#1A1A1A' }}>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-3 pt-2">
            <span style={{ color: '#1A1A1A' }}>Total</span>
            <span style={{ color: '#F5C800' }}>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Order Info */}
        <div className="rounded-2xl p-5 mb-4 bg-white" style={{ border: '1px solid #e5e5e5' }}>
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: '#888' }}>Location</span>
            <span className="font-medium" style={{ color: '#1A1A1A' }}>{location}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: '#888' }}>Order Type</span>
            <span className="font-medium capitalize" style={{ color: '#1A1A1A' }}>{orderType}</span>
          </div>
        </div>

        {/* Customer Details */}
        <div className="rounded-2xl p-5 mb-4 bg-white" style={{ border: '1px solid #e5e5e5' }}>
          <h3 className="font-bold mb-4" style={{ color: '#1A1A1A' }}>Your Details</h3>
          <div className="space-y-3">
            <input placeholder="Full Name *" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ border: '1px solid #e5e5e5', color: '#1A1A1A' }} />
            <input placeholder="Phone Number *" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ border: '1px solid #e5e5e5', color: '#1A1A1A' }} />
            <textarea placeholder="Special instructions (optional)" value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ border: '1px solid #e5e5e5', color: '#1A1A1A' }} />
          </div>
        </div>

        {error && <p className="text-sm text-center mb-3" style={{ color: '#ff4444' }}>{error}</p>}

        <button onClick={handleSubmit} disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-lg"
          style={{ backgroundColor: '#F5C800', color: '#1A1A1A' }}>
          {loading ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  )
}
