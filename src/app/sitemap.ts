import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { RESTAURANT_ID } from '@/lib/restaurant'
import { storeSlug } from '@/lib/storePages'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://angiesknb.com'
  const now = new Date()
  let stores: MetadataRoute.Sitemap = []
  try {
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } })
    const { data } = await db.from('locations').select('name').eq('restaurant_id', RESTAURANT_ID).eq('is_active', true)
    stores = (data || []).map(l => ({ url: `${base}/${storeSlug(l.name)}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 }))
  } catch {}
  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/menu`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...stores,
    { url: `${base}/delivery`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
