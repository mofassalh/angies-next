import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import { RESTAURANT_ID } from '@/lib/restaurant'

export const metadata: Metadata = {
  title: 'Menu',
  description: "Order halal kebabs, HSPs, burgers and more online for pickup from Angie's Kebabs & Burgers in St Albans, Fitzroy North and Ascot Vale.",
  alternates: { canonical: '/menu' },
}

async function getMenuSchema() {
  try {
    const supabase = createClient()
    const [{ data: items }, { data: order }] = await Promise.all([
      supabase
        .from('menu_items')
        .select('name, description, price, category')
        .eq('restaurant_id', RESTAURANT_ID)
        .eq('available', true)
        .order('sort_order'),
      supabase
        .from('settings')
        .select('value')
        .eq('key', 'category_order')
        .eq('restaurant_id', RESTAURANT_ID)
        .maybeSingle(),
    ])
    if (!items || items.length === 0) return null

    let categoryOrder: string[] = []
    try { categoryOrder = order?.value ? JSON.parse(order.value) : [] } catch {}
    const raw = [...new Set(items.map((i: any) => i.category).filter(Boolean))] as string[]
    const categories = [...categoryOrder.filter(c => raw.includes(c)), ...raw.filter(c => !categoryOrder.includes(c))]

    return {
      '@context': 'https://schema.org',
      '@type': 'Menu',
      name: "Angie's Kebabs & Burgers Menu",
      url: 'https://angiesknb.com/menu',
      hasMenuSection: categories.map(cat => ({
        '@type': 'MenuSection',
        name: cat,
        hasMenuItem: items
          .filter((i: any) => i.category === cat)
          .map((i: any) => ({
            '@type': 'MenuItem',
            name: i.name,
            ...(i.description ? { description: i.description } : {}),
            ...(i.price != null
              ? { offers: { '@type': 'Offer', price: Number(i.price).toFixed(2), priceCurrency: 'AUD' } }
              : {}),
          })),
      })),
    }
  } catch {
    return null
  }
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const schema = await getMenuSchema()
  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
      )}
      {children}
    </>
  )
}
