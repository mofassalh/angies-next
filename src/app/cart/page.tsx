'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import Navbar from '@/components/Navbar'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const { items, removeItem, updateQuantity, getSubtotal, getGST, getTotal } = useCartStore()

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar selectedLocation={null} onLocationClick={() => {}} />

      <div className="pt-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8" style={{fontFamily: 'var(--font-display)'}}>
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-400 mb-6">Add some delicious items from our menu</p>
            <Link
              href="/menu"
              className="px-8 py-3 rounded-full text-white font-semibold"
              style={{background: 'var(--color-primary)'}}
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">

            {/* Items */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-5 flex gap-4 ${index !== items.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0" style={{background: '#FFF7F4'}}>
                    {item.name.toLowerCase().includes('burger') ? '🍔' :
                     item.name.toLowerCase().includes('kebab') ? '🥙' :
                     item.name.toLowerCase().includes('wrap') ? '🌯' :
                     item.name.toLowerCase().includes('fries') ? '🍟' :
                     item.name.toLowerCase().includes('drink') ? '🥤' : '🍽️'}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors ml-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {item.selectedOptions.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.selectedOptions.map((opt, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            {opt.optionName}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-full px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center font-bold text-gray-600 text-sm"
                        >
                          −
                        </button>
                        <span className="font-bold text-gray-900 w-5 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-sm"
                          style={{background: 'var(--color-primary)'}}
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold" style={{color: 'var(--color-primary)'}}>
                        ${item.lineTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (10%)</span>
                  <span>${getGST().toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-5 w-full py-4 rounded-full text-white font-semibold text-center block transition-all hover:shadow-lg hover:scale-105"
                style={{background: 'var(--color-primary)'}}
              >
                Proceed to Checkout →
              </Link>

              <Link
                href="/menu"
                className="mt-3 w-full py-3 rounded-full font-semibold text-center block border-2 transition-all hover:bg-orange-50"
                style={{borderColor: 'var(--color-primary)', color: 'var(--color-primary)'}}
              >
                Add More Items
              </Link>
            </div>

          </div>
        )}
      </div>
    </main>
  )
}
