'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductModal from '@/components/ProductModal'

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  description: string
  base_price: number
  image_url: string | null
  category_id: string
  tags: string[]
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [locationId, setLocationId] = useState<string | null>(null)

  useEffect(() => {
    const locName = localStorage.getItem('selectedLocationName')
    const locId = localStorage.getItem('selectedLocationId')
    setSelectedLocation(locName)
    setLocationId(locId)
    fetchData(locId)
  }, [])

  const fetchData = async (locId: string | null) => {
    const supabase = createClient()

    const { data: cats } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    const { data: prods } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)

    if (cats) setCategories(cats)
    if (prods) setProducts(prods)
    setLoading(false)
  }

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category_id === activeCategory)

  const emojis: Record<string, string> = {
    'burger': '🍔',
    'kebab': '🥙',
    'wrap': '🌯',
    'fries': '🍟',
    'drinks': '🥤',
    'sides': '🍱',
    'default': '🍽️'
  }

  const getEmoji = (name: string) => {
    const lower = name.toLowerCase()
    for (const key of Object.keys(emojis)) {
      if (lower.includes(key)) return emojis[key]
    }
    return emojis.default
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar
        selectedLocation={selectedLocation}
        onLocationClick={() => {}}
      />

      <div className="pt-16">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'var(--font-display)'}}>
              Our Menu
            </h1>
            {selectedLocation && (
              <p className="text-gray-500 mt-1 text-sm">
                📍 {selectedLocation}
              </p>
            )}
          </div>

          {/* Category tabs */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
              <button
                onClick={() => setActiveCategory('all')}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === 'all'
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={activeCategory === 'all' ? {background: 'var(--color-primary)'} : {}}
              >
                All Items
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeCategory === cat.id
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={activeCategory === cat.id ? {background: 'var(--color-primary)'} : {}}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-44 bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No items yet</h3>
              <p className="text-gray-400">Menu items will appear here once added from the admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                >
                  <div className="h-44 flex items-center justify-center relative" style={{background: 'linear-gradient(135deg, #FFF7F4, #FFF0EA)'}}>
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {getEmoji(product.name)}
                    </span>
                    {product.tags?.includes('popular') && (
                      <div className="absolute top-3 left-3 text-white text-xs font-semibold px-2 py-1 rounded-full" style={{background: 'var(--color-primary)'}}>
                        Popular
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">
                      {product.description || 'Freshly prepared to order'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold" style={{color: 'var(--color-primary)'}}>
                        ${product.base_price.toFixed(2)}
                      </span>
                      <button
                        className="w-8 h-8 rounded-full text-white flex items-center justify-center text-lg font-bold hover:scale-110 transition-transform"
                        style={{background: 'var(--color-primary)'}}
                      >
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
