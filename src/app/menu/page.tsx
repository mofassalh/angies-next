'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
  available: boolean
  location: string
  customizations: any[]
}

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  selectedOptions: any
  image_url: string
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCat, setFilterCat] = useState('All')
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<any>({})
  const [showCart, setShowCart] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const location = typeof window !== 'undefined' ? localStorage.getItem('selectedLocationName') || 'All' : 'All'
  const orderType = typeof window !== 'undefined' ? localStorage.getItem('orderType') || 'pickup' : 'pickup'

  useEffect(() => {
    fetchMenu()
    const saved = localStorage.getItem('cart')
    if (saved) setCart(JSON.parse(saved))
  }, [])

  const fetchMenu = async () => {
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .eq('available', true)
      .order('category')
    setItems(data || [])
    setLoading(false)
  }

  const categories = ['All', ...new Set(items.map(i => i.category).filter(Boolean))]

  const filtered = filterCat === 'All' ? items : items.filter(i => i.category === filterCat)

  const openItem = (item: MenuItem) => {
    setSelectedItem(item)
    setSelectedOptions({})
  }

  const selectOption = (sectionName: string, option: any, type: string, max: number) => {
    if (type === 'radio') {
      setSelectedOptions((prev: any) => ({ ...prev, [sectionName]: option }))
    } else {
      const current = selectedOptions[sectionName] || []
      const exists = current.find((o: any) => o.name === option.name)
      if (exists) {
        setSelectedOptions((prev: any) => ({ ...prev, [sectionName]: current.filter((o: any) => o.name !== option.name) }))
      } else if (current.length < max) {
        setSelectedOptions((prev: any) => ({ ...prev, [sectionName]: [...current, option] }))
      }
    }
  }

  const getItemTotal = () => {
    if (!selectedItem) return 0
    let total = selectedItem.price
    Object.values(selectedOptions).forEach((opt: any) => {
      if (Array.isArray(opt)) opt.forEach((o: any) => { total += o.price || 0 })
      else if (opt) total += opt.price || 0
    })
    return total
  }

  const addToCart = () => {
    if (!selectedItem) return
    const newItem: CartItem = {
      id: selectedItem.id,
      name: selectedItem.name,
      price: getItemTotal(),
      quantity: 1,
      selectedOptions,
      image_url: selectedItem.image_url,
    }
    const existing = cart.find(c => c.id === selectedItem.id && JSON.stringify(c.selectedOptions) === JSON.stringify(selectedOptions))
    let newCart
    if (existing) {
      newCart = cart.map(c => c.id === existing.id && JSON.stringify(c.selectedOptions) === JSON.stringify(selectedOptions)
        ? { ...c, quantity: c.quantity + 1 } : c)
    } else {
      newCart = [...cart, newItem]
    }
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    setSelectedItem(null)
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFDF5' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} style={{ color: '#888' }}>←</button>
          <div>
            <h1 className="font-bold" style={{ color: '#1A1A1A' }}>Angie's Menu</h1>
            <p className="text-xs" style={{ color: '#888' }}>{location} · {orderType}</p>
          </div>
        </div>
        <button onClick={() => setShowCart(true)}
          className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm"
          style={{ backgroundColor: '#F5C800', color: '#1A1A1A' }}>
          🛒 Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
              style={{ backgroundColor: '#1A1A1A', color: '#F5C800' }}>{cartCount}</span>
          )}
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
            style={{
              backgroundColor: filterCat === cat ? '#F5C800' : '#fff',
              color: filterCat === cat ? '#1A1A1A' : '#666',
              border: '1px solid #e5e5e5'
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="max-w-4xl mx-auto px-4 pb-24">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 rounded-full border-2 animate-spin mx-auto"
              style={{ borderColor: '#F5C800', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filtered.map(item => (
              <button key={item.id} onClick={() => openItem(item)}
                className="text-left rounded-2xl overflow-hidden bg-white transition"
                style={{ border: '1px solid #e5e5e5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div className="w-full h-44 overflow-hidden flex items-center justify-center"
                  style={{ backgroundColor: '#f9f9f9' }}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">🍽️</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1" style={{ color: '#1A1A1A' }}>{item.name}</h3>
                  {item.description && <p className="text-xs mb-2 line-clamp-2" style={{ color: '#888' }}>{item.description}</p>}
                  <div className="flex items-center justify-between">
                    <span className="font-bold" style={{ color: '#F5C800' }}>${item.price.toFixed(2)}</span>
                    <span className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-lg"
                      style={{ backgroundColor: '#F5C800', color: '#1A1A1A' }}>+</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-y-auto max-h-[90vh]"
            style={{ backgroundColor: '#fff' }}>
            {selectedItem.image_url && (
              <div className="w-full h-52 overflow-hidden">
                <img src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>{selectedItem.name}</h3>
                <button onClick={() => setSelectedItem(null)} style={{ color: '#aaa' }} className="text-xl ml-4">✕</button>
              </div>
              {selectedItem.description && (
                <p className="text-sm mb-4" style={{ color: '#888' }}>{selectedItem.description}</p>
              )}

              {/* Customizations */}
              {(selectedItem.customizations || []).map((section: any) => (
                <div key={section.name} className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>{section.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#f5f5f5', color: '#888' }}>
                      {section.type === 'radio' ? 'Pick 1' : `Pick up to ${section.max}`}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {section.options.map((opt: any) => {
                      const isSelected = section.type === 'radio'
                        ? selectedOptions[section.name]?.name === opt.name
                        : (selectedOptions[section.name] || []).find((o: any) => o.name === opt.name)
                      return (
                        <button key={opt.name}
                          onClick={() => selectOption(section.name, opt, section.type, section.max)}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition"
                          style={{
                            backgroundColor: isSelected ? '#FFF8E1' : '#f9f9f9',
                            border: isSelected ? '2px solid #F5C800' : '2px solid transparent'
                          }}>
                          <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{opt.name}</span>
                          <div className="flex items-center gap-2">
                            {opt.price > 0 && <span className="text-xs" style={{ color: '#888' }}>+${opt.price.toFixed(2)}</span>}
                            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                              style={{ borderColor: isSelected ? '#F5C800' : '#ddd', backgroundColor: isSelected ? '#F5C800' : 'transparent' }}>
                              {isSelected && <span className="text-xs font-bold" style={{ color: '#1A1A1A' }}>✓</span>}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              <button onClick={addToCart}
                className="w-full py-4 rounded-2xl font-bold text-lg mt-4"
                style={{ backgroundColor: '#F5C800', color: '#1A1A1A' }}>
                Add to Cart — ${getItemTotal().toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm h-full flex flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid #e5e5e5' }}>
              <h3 className="text-lg font-bold" style={{ color: '#1A1A1A' }}>Your Cart</h3>
              <button onClick={() => setShowCart(false)} style={{ color: '#aaa' }}>✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <p className="text-center text-sm mt-8" style={{ color: '#aaa' }}>Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: '#f5f5f5' }}>
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : <span className="text-2xl flex items-center justify-center h-full">🍽️</span>}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm" style={{ color: '#1A1A1A' }}>{item.name}</p>
                        {Object.entries(item.selectedOptions || {}).map(([k, v]: any) => (
                          <p key={k} className="text-xs" style={{ color: '#aaa' }}>
                            {k}: {Array.isArray(v) ? v.map((o: any) => o.name).join(', ') : v?.name}
                          </p>
                        ))}
                        <p className="text-sm font-semibold mt-1" style={{ color: '#F5C800' }}>${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <button onClick={() => removeFromCart(i)} style={{ color: '#ff4444', fontSize: '18px' }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-6" style={{ borderTop: '1px solid #e5e5e5' }}>
                <div className="flex justify-between font-bold mb-4">
                  <span style={{ color: '#1A1A1A' }}>Total</span>
                  <span style={{ color: '#F5C800' }}>${cartTotal.toFixed(2)}</span>
                </div>
                <button onClick={() => { setShowCart(false); router.push('/checkout') }}
                  className="w-full py-4 rounded-2xl font-bold text-lg"
                  style={{ backgroundColor: '#1A1A1A', color: '#fff' }}>
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
