'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useCartStore } from '@/store/cartStore'

interface Option {
  id: string
  name: string
  price: number
  is_available: boolean
}

interface OptionGroup {
  id: string
  name: string
  type: string
  is_required: boolean
  min_selections: number
  max_selections: number
  options: Option[]
}

interface Product {
  id: string
  name: string
  description: string
  base_price: number
  image_url: string | null
  tags: string[]
}

interface ProductModalProps {
  product: Product
  onClose: () => void
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([])
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({})
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(state => state.addItem)

  useEffect(() => {
    fetchOptionGroups()
  }, [product.id])

  const fetchOptionGroups = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('product_option_groups')
      .select(`
        display_order,
        option_groups (
          id, name, type, is_required, min_selections, max_selections, options
        )
      `)
      .eq('product_id', product.id)
      .order('display_order')

    if (data) {
      const groups = data.map((d: any) => d.option_groups).filter(Boolean)
      setOptionGroups(groups)
      const initial: Record<string, string[]> = {}
      groups.forEach((g: OptionGroup) => { initial[g.id] = [] })
      setSelectedOptions(initial)
    }
    setLoading(false)
  }

  const toggleOption = (groupId: string, optionId: string, type: string, max: number) => {
    setSelectedOptions(prev => {
      const current = prev[groupId] || []
      if (type === 'radio') {
        return { ...prev, [groupId]: [optionId] }
      } else {
        if (current.includes(optionId)) {
          return { ...prev, [groupId]: current.filter(id => id !== optionId) }
        } else if (current.length < max) {
          return { ...prev, [groupId]: [...current, optionId] }
        }
        return prev
      }
    })
  }

  const calculateOptionsPrice = () => {
    let total = 0
    optionGroups.forEach(group => {
      const selected = selectedOptions[group.id] || []
      selected.forEach(optId => {
        const opt = group.options.find(o => o.id === optId)
        if (opt) total += opt.price
      })
    })
    return total
  }

  const optionsPrice = calculateOptionsPrice()
  const totalPrice = (product.base_price + optionsPrice) * quantity

  const handleAddToCart = () => {
    const selectedOpts: CartItem['selectedOptions'] = []
    optionGroups.forEach(group => {
      const selected = selectedOptions[group.id] || []
      selected.forEach(optId => {
        const opt = group.options.find(o => o.id === optId)
        if (opt) {
          selectedOpts.push({
            groupId: group.id,
            groupName: group.name,
            optionId: opt.id,
            optionName: opt.name,
            price: opt.price,
          })
        }
      })
    })

    addItem({
      productId: product.id,
      name: product.name,
      price: product.base_price,
      quantity,
      selectedOptions: selectedOpts,
      optionsPrice,
      lineTotal: totalPrice,
    })

    setAdded(true)
    setTimeout(() => {
      onClose()
    }, 800)
  }

  const emojis: Record<string, string> = {
    'burger': '🍔', 'kebab': '🥙', 'wrap': '🌯',
    'fries': '🍟', 'drinks': '🥤', 'default': '🍽️'
  }
  const getEmoji = (name: string) => {
    const lower = name.toLowerCase()
    for (const key of Object.keys(emojis)) {
      if (lower.includes(key)) return emojis[key]
    }
    return emojis.default
  }

  // Fix the CartItem type import
  type CartItem = Parameters<typeof addItem>[0] & { id: string }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto">

        <div className="h-48 flex items-center justify-center relative" style={{background: 'linear-gradient(135deg, #FFF7F4, #FFF0EA)'}}>
          <span className="text-8xl">{getEmoji(product.name)}</span>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1" style={{fontFamily: 'var(--font-display)'}}>
            {product.name}
          </h2>
          <p className="text-gray-500 text-sm mb-2">
            {product.description || 'Freshly prepared to order'}
          </p>
          <div className="text-xl font-bold mb-6" style={{color: 'var(--color-primary)'}}>
            ${product.base_price.toFixed(2)}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {optionGroups.map(group => (
                <div key={group.id}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{group.name}</h3>
                    <div className="flex gap-2">
                      {group.is_required && (
                        <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{background: 'var(--color-primary)'}}>
                          Required
                        </span>
                      )}
                      {group.type === 'checkbox' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          Max {group.max_selections}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {group.options.filter(o => o.is_available).map(option => {
                      const isSelected = (selectedOptions[group.id] || []).includes(option.id)
                      return (
                        <button
                          key={option.id}
                          onClick={() => toggleOption(group.id, option.id, group.type, group.max_selections)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                            isSelected ? 'border-orange-400 bg-orange-50' : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected ? 'border-orange-400' : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <div className="w-2.5 h-2.5 rounded-full" style={{background: 'var(--color-primary)'}} />
                              )}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{option.name}</span>
                          </div>
                          {option.price > 0 && (
                            <span className="text-sm font-semibold" style={{color: 'var(--color-primary)'}}>
                              +${option.price.toFixed(2)}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50"
              >
                −
              </button>
              <span className="font-bold text-gray-900 w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold"
                style={{background: 'var(--color-primary)'}}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 rounded-full text-white font-semibold transition-all hover:shadow-lg hover:scale-105 active:scale-95"
              style={{background: added ? '#10B981' : 'var(--color-primary)'}}
            >
              {added ? '✓ Added to Cart!' : `Add to Cart — $${totalPrice.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
