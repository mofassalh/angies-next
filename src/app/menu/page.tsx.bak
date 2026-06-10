'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductModal from '@/components/ProductModal'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image_url: string | null
  category: string
  available: boolean
  location: string
  customizations: any[]
  is_popular?: boolean
  is_special?: boolean
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  useEffect(() => {
    const locName = localStorage.getItem('selectedLocationName')
    setSelectedLocation(locName)
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .eq('available', true)
      .order('category')
    if (data) setItems(data)
    setLoading(false)
  }

  const categories = [...new Set(items.map(i => i.category).filter(Boolean))]

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(p => p.category === activeCategory)

  const emojis: Record<string, string> = {
    'burger': '🍔', 'kebab': '🥙', 'wrap': '🌯',
    'fries': '🍟', 'drinks': '🥤', 'sides': '🍱',
    'dessert': '🍮', 'default': '🍽️'
  }

  const getEmoji = (name: string) => {
    const lower = name.toLowerCase()
    for (const key of Object.keys(emojis)) {
      if (lower.includes(key)) return emojis[key]
    }
    return emojis.default
  }

  // Convert menu_item to product format for ProductModal
  const toProduct = (item: MenuItem) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    base_price: item.price,
    image_url: item.image_url,
    category_id: item.category,
    tags: [],
    customizations: item.customizations || [],
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar selectedLocation={selectedLocation} onLocationClick={() => {}} />

      <div className="pt-16">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'var(--font-display)'}}>
              Our Menu
            </h1>
            {selectedLocation && (
              <p className="text-gray-500 mt-1 text-sm">📍 {selectedLocation}</p>
            )}
          </div>

          {/* Category tabs */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
              <button
                onClick={() => setActiveCategory('all')}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === 'all' ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={activeCategory === 'all' ? {background: 'var(--color-primary)'} : {}}>
                All Items
              </button>
              {categories.map(cat => (
                <button key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeCategory === cat ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={activeCategory === cat ? {background: 'var(--color-primary)'} : {}}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-44 bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No items yet</h3>
              <p className="text-gray-400">Menu items will appear here once added from the admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <div key={item.id}
                  onClick={() => setSelectedProduct(toProduct(item))}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <div className="h-44 flex items-center justify-center relative overflow-hidden"
                    style={{background: 'linear-gradient(135deg, #FFF7F4, #FFF0EA)'}}>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                        {getEmoji(item.name)}
                      </span>
                    )}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {item.is_popular && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{background:'#F5C800', color:'#1A1A1A'}}>⭐ Popular</span>
                      )}
                      {item.is_special && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{background:'#22c55e', color:'white'}}>🎯 Special</span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">
                      {item.description || 'Freshly prepared to order'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold" style={{color: 'var(--color-primary)'}}>
                        ${item.price.toFixed(2)}
                      </span>
                      <button className="w-8 h-8 rounded-full text-white flex items-center justify-center text-lg font-bold hover:scale-110 transition-transform"
                        style={{background: 'var(--color-primary)'}}>
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  )
}
