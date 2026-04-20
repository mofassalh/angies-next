'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import ProductModal from '@/components/ProductModal'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  base_price: number
  image_url: string | null
  category: string
  customizations?: any[]
  tags?: string[]
}

interface FeaturedItemsProps {
  onOrderClick: () => void
}

export default function FeaturedItems({ onOrderClick }: FeaturedItemsProps) {
  const [items, setItems] = useState<MenuItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await supabase
        .from('menu_items')
        .select('*')
        .eq('available', true)
        .limit(4)
      if (data) setItems(data)
    }
    fetchItems()
  }, [])

  const emojis: Record<string, string> = {
    burger: '🍔', kebab: '🥙', wrap: '🌯',
    fries: '🍟', drinks: '🥤', sides: '🍱',
    dessert: '🍮', default: '🍽️'
  }

  const getEmoji = (name: string) => {
    const lower = name.toLowerCase()
    for (const key of Object.keys(emojis)) {
      if (lower.includes(key)) return emojis[key]
    }
    return emojis.default
  }

  const handleItemClick = (item: MenuItem) => {
    const location = localStorage.getItem('selectedLocationName')
    if (!location) {
      onOrderClick()
      return
    }
    setSelectedProduct({
      id: item.id,
      name: item.name,
      description: item.description,
      base_price: item.base_price ?? item.price,
      image_url: item.image_url,
      tags: item.tags || [],
      customizations: item.customizations || [],
    })
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{background: '#FEE2D5', color: 'var(--color-primary)'}}>
            Featured Items
          </div>
          <h2 className="text-4xl font-bold" style={{fontFamily: 'var(--font-display)'}}>
            Customer Favourites
          </h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            Our most loved dishes, made fresh to order every single time
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => handleItemClick(item)}>
              <div className="h-44 flex items-center justify-center relative overflow-hidden"
                style={{background: 'linear-gradient(135deg, #FFF7F4, #FFF0EA)'}}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {getEmoji(item.name)}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">
                  {item.description || 'Freshly prepared to order'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold" style={{color: 'var(--color-primary)'}}>
                    ${(item.base_price ?? item.price).toFixed(2)}
                  </span>
                  <button
                    className="w-8 h-8 rounded-full text-white flex items-center justify-center text-lg font-bold hover:scale-110 transition-transform"
                    style={{background: 'var(--color-primary)'}}>
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => {
              const location = localStorage.getItem('selectedLocationName')
              if (location) router.push('/menu')
              else onOrderClick()
            }}
            className="px-8 py-3 rounded-full font-semibold border-2 transition-all hover:bg-orange-50"
            style={{borderColor: 'var(--color-primary)', color: 'var(--color-primary)'}}>
            View Full Menu
          </button>
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  )
}
