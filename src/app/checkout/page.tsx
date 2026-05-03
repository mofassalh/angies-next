'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase'

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    address: '', suburb: '', postcode: '', notes: '',
  })
  const router = useRouter()
  const { items, getSubtotal, getGST, getTotal, clearCart } = useCartStore()

  useEffect(() => {
    setMounted(true)
    const savedType = localStorage.getItem('orderType')
    if (savedType) setOrderType(savedType as 'pickup' | 'delivery')

    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login?redirect=/checkout')
      } else {
        const meta = data.user.user_metadata
        setForm(f => ({
          ...f,
          name: meta?.full_name || '',
          email: data.user?.email || '',
          phone: meta?.phone || '',
        }))
        setAuthChecked(true)
      }
    })
  }, [])

  if (!mounted || !authChecked) return null

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar selectedLocation={null} onLocationClick={() => {}} />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Your cart is empty</h3>
            <Link href="/menu" className="px-8 py-3 rounded-full text-white font-semibold" style={{background: 'var(--color-primary)'}}>
              Browse Menu
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const deliveryFee = orderType === 'delivery' ? 5.00 : 0
  const finalTotal = getTotal() + deliveryFee

  const handleSubmit = async () => {
    setLoading(true)
    const supabase = createClient()
    const locationName = localStorage.getItem('selectedLocationName') || ''
    const locationId = localStorage.getItem('selectedLocationId') || ''
    const orderNumber = `#${Math.floor(10000 + Math.random() * 90000)}`

    const orderItems = items.map(item => ({
      id: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      selectedOptions: item.selectedOptions,
      optionsPrice: item.optionsPrice,
      lineTotal: item.lineTotal,
    }))

    const { data: userData } = await supabase.auth.getUser()

    const { data: orderData, error } = await supabase.from('orders').insert({
      order_number: orderNumber,
      customer_name: form.name,
      customer_phone: form.phone,
      customer_email: form.email,
      customer_address: orderType === 'delivery'
        ? `${form.address}, ${form.suburb} ${form.postcode}`
        : '',
      order_type: orderType,
      location: locationName,
      items: orderItems,
      total: finalTotal,
      status: 'pending',
      notes: form.notes,
      user_id: userData.user?.id || null,
    }).select().single()

    if (error) {
      alert('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    clearCart()
    router.push(`/order-confirmed?order=${orderNumber}&id=${orderData?.id || ''}`)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar selectedLocation={null} onLocationClick={() => {}} />

      <div className="pt-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{fontFamily: 'var(--font-display)'}}>
          Checkout
        </h1>

        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{ background: step >= s ? 'var(--color-primary)' : '#E5E7EB', color: step >= s ? 'white' : '#9CA3AF' }}>
                {s}
              </div>
              <span className={`text-sm font-medium ${step >= s ? 'text-gray-900' : 'text-gray-400'}`}>
                {s === 1 ? 'Order Details' : 'Review & Place Order'}
              </span>
              {s < 2 && <div className="w-8 h-px bg-gray-200 ml-1" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {step === 1 && (
              <>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">How would you like your order?</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setOrderType('pickup')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${orderType === 'pickup' ? 'border-orange-400 bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <div className="text-2xl mb-2">🏃</div>
                      <div className="font-semibold text-gray-900">Pickup</div>
                      <div className="text-xs text-gray-500 mt-0.5">Ready in 15-20 min</div>
                      <div className="text-xs font-semibold mt-1" style={{color: 'var(--color-primary)'}}>Free</div>
                    </button>
                    <button onClick={() => setOrderType('delivery')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${orderType === 'delivery' ? 'border-orange-400 bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <div className="text-2xl mb-2">🛵</div>
                      <div className="font-semibold text-gray-900">Delivery</div>
                      <div className="text-xs text-gray-500 mt-0.5">30-45 min est.</div>
                      <div className="text-xs font-semibold mt-1" style={{color: 'var(--color-primary)'}}>$5.00</div>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Full Name *</label>
                        <input type="text" value={form.name}
                          onChange={e => setForm({...form, name: e.target.value})}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
                          placeholder="John Smith" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Phone *</label>
                        <input type="tel" value={form.phone}
                          onChange={e => setForm({...form, phone: e.target.value})}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
                          placeholder="04XX XXX XXX" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Email *</label>
                      <input type="email" value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
                        placeholder="john@example.com" />
                    </div>
                  </div>
                </div>

                {orderType === 'delivery' && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Delivery Address</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Street Address *</label>
                        <input type="text" value={form.address}
                          onChange={e => setForm({...form, address: e.target.value})}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
                          placeholder="123 Main Street" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">Suburb *</label>
                          <input type="text" value={form.suburb}
                            onChange={e => setForm({...form, suburb: e.target.value})}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
                            placeholder="St Albans" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">Postcode *</label>
                          <input type="text" value={form.postcode}
                            onChange={e => setForm({...form, postcode: e.target.value})}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
                            placeholder="3021" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Special Instructions</h3>
                  <textarea value={form.notes}
                    onChange={e => setForm({...form, notes: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400 resize-none"
                    rows={3} placeholder="Any special requests or allergies?" />
                </div>

                <button onClick={() => setStep(2)}
                  disabled={!form.name || !form.phone || !form.email}
                  className="w-full py-4 rounded-full text-white font-semibold transition-all hover:shadow-lg disabled:opacity-50"
                  style={{background: 'var(--color-primary)'}}>
                  Continue to Review →
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Order Review</h3>
                    <button onClick={() => setStep(1)} className="text-sm font-medium" style={{color: 'var(--color-primary)'}}>Edit</button>
                  </div>
                  <div className="space-y-3 mb-4">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div>
                          <span className="font-medium text-gray-900">{item.name}</span>
                          <span className="text-gray-400 ml-2">×{item.quantity}</span>
                          {item.selectedOptions.length > 0 && (
                            <div className="text-xs text-gray-400 mt-0.5">
                              {item.selectedOptions.map((o: any) => o.optionName).join(', ')}
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-gray-900">${item.lineTotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${getSubtotal().toFixed(2)}</span></div>
                    <div className="flex justify-between text-gray-500"><span>GST (10%)</span><span>${getGST().toFixed(2)}</span></div>
                    {orderType === 'delivery' && (
                      <div className="flex justify-between text-gray-500"><span>Delivery Fee</span><span>${deliveryFee.toFixed(2)}</span></div>
                    )}
                    <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
                      <span>Total</span><span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {orderType === 'pickup' ? '🏃 Pickup' : '🛵 Delivery'}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>{form.name} · {form.phone}</div>
                    <div>{form.email}</div>
                    {orderType === 'delivery' && (
                      <div>{form.address}, {form.suburb} {form.postcode}</div>
                    )}
                  </div>
                </div>

                <button onClick={handleSubmit} disabled={loading}
                  className="w-full py-4 rounded-full text-white font-semibold transition-all hover:shadow-lg hover:scale-105"
                  style={{background: 'var(--color-primary)'}}>
                  {loading ? 'Placing Order...' : `Place Order — $${finalTotal.toFixed(2)}`}
                </button>
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Your Order ({items.length} {items.length === 1 ? 'item' : 'items'})</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} ×{item.quantity}</span>
                    <span className="font-medium">${item.lineTotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span style={{color: 'var(--color-primary)'}}>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
