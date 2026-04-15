'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

interface Option {
  name: string
  price: number
}

interface Section {
  name: string
  type: 'radio' | 'checkbox'
  max: number
  options: Option[]
}

interface Product {
  id: string
  name: string
  description: string
  base_price: number
  image_url: string | null
  tags: string[]
  customizations?: Section[]
}

interface ProductModalProps {
  product: Product
  onClose: () => void
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({})
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(state => state.addItem)
  const router = useRouter()

  const customizations: Section[] = product.customizations || []

  const selectOption = (sectionName: string, option: Option, type: string, max: number) => {
    if (type === 'radio') {
      setSelectedOptions(prev => ({ ...prev, [sectionName]: option }))
    } else {
      const current = selectedOptions[sectionName] || []
      const exists = current.find((o: Option) => o.name === option.name)
      if (exists) {
        setSelectedOptions(prev => ({ ...prev, [sectionName]: current.filter((o: Option) => o.name !== option.name) }))
      } else if (current.length < max) {
        setSelectedOptions(prev => ({ ...prev, [sectionName]: [...current, option] }))
      }
    }
  }

  const calculateOptionsPrice = () => {
    let total = 0
    Object.values(selectedOptions).forEach((opt: any) => {
      if (Array.isArray(opt)) opt.forEach((o: Option) => { total += o.price || 0 })
      else if (opt) total += opt.price || 0
    })
    return total
  }

  const optionsPrice = calculateOptionsPrice()
  const totalPrice = (product.base_price + optionsPrice) * quantity

  const buildCartItem = () => {
    const selectedOpts: any[] = []
    Object.entries(selectedOptions).forEach(([sectionName, opt]: any) => {
      if (Array.isArray(opt)) {
        opt.forEach((o: Option) => {
          selectedOpts.push({ groupName: sectionName, optionName: o.name, price: o.price })
        })
      } else if (opt) {
        selectedOpts.push({ groupName: sectionName, optionName: opt.name, price: opt.price })
      }
    })
    return {
      productId: product.id,
      name: product.name,
      price: product.base_price,
      quantity,
      selectedOptions: selectedOpts,
      optionsPrice,
      lineTotal: totalPrice,
    }
  }

  const handleAddMore = () => {
    addItem(buildCartItem())
    setAdded(true)
    setTimeout(() => { onClose() }, 600)
  }

  const handleCheckout = () => {
    addItem(buildCartItem())
    onClose()
    router.push('/checkout')
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto">

        <div className="h-48 flex items-center justify-center relative overflow-hidden"
          style={{background: 'linear-gradient(135deg, #FFF7F4, #FFF0EA)'}}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-8xl">{getEmoji(product.name)}</span>
          )}
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100 transition-colors">
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

          {customizations.length > 0 && (
            <div className="space-y-6">
              {customizations.map((section: Section) => (
                <div key={section.name}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{section.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      {section.type === 'radio' ? 'Pick 1' : `Max ${section.max}`}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {section.options.map((option: Option) => {
                      const isSelected = section.type === 'radio'
                        ? selectedOptions[section.name]?.name === option.name
                        : (selectedOptions[section.name] || []).find((o: Option) => o.name === option.name)
                      return (
                        <button key={option.name}
                          onClick={() => selectOption(section.name, option, section.type, section.max)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                            isSelected ? 'border-orange-400 bg-orange-50' : 'border-gray-100 hover:border-gray-200'
                          }`}>
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
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50">
                −
              </button>
              <span className="font-bold text-gray-900 w-6 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}
                className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold"
                style={{background: 'var(--color-primary)'}}>
                +
              </button>
            </div>
            <div className="flex-1 text-right">
              <span className="text-lg font-bold" style={{color: 'var(--color-primary)'}}>
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button onClick={handleAddMore}
              disabled={added}
              className="py-3 rounded-full font-semibold border-2 transition-all hover:bg-orange-50 disabled:opacity-60"
              style={{borderColor: added ? '#10B981' : 'var(--color-primary)', color: added ? '#10B981' : 'var(--color-primary)'}}>
              {added ? '✓ Added!' : 'Add More'}
            </button>
            <button onClick={handleCheckout}
              className="py-3 rounded-full text-white font-semibold transition-all hover:shadow-lg hover:scale-105"
              style={{background: 'var(--color-primary)'}}>
              Checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
