import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient as createSupabase } from '@supabase/supabase-js'
import { RESTAURANT_ID } from '@/lib/restaurant'
import Footer from '@/components/Footer'
import { StoreNavbar, OrderNowButton, OpenBadge } from '@/components/StorePageClient'
import {
  areaName, storeSlug, parseHours, groupedHours, latestClose, hoursSchema,
  postalAddress, prettyPhone, intlPhone,
} from '@/lib/storePages'

// Per-store SEO pages: /st-albans, /fitzroy-north, /ascot-vale …
// The list of stores and all their details come from the `locations` table.

export const revalidate = 3600 // refresh store details every hour

const SITE = 'https://angiesknb.com'

function db() {
  return createSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  })
}

async function getLocations() {
  const { data } = await db()
    .from('locations')
    .select('id, name, address, suburb, postcode, phone, opening_hours, is_open')
    .eq('restaurant_id', RESTAURANT_ID)
    .eq('is_active', true)
    .order('name')
  return data || []
}

async function getStore(slug: string) {
  const all = await getLocations()
  const loc = all.find(l => storeSlug(l.name) === slug)
  return { loc, others: all.filter(l => l !== loc) }
}

async function getPopular() {
  const { data } = await db()
    .from('menu_items')
    .select('id, name, description, price, image_url')
    .eq('restaurant_id', RESTAURANT_ID)
    .eq('is_popular', true)
    .eq('available', true)
    .order('sort_order')
    .limit(4)
  return data || []
}

async function getBusinessName() {
  const { data } = await db()
    .from('settings')
    .select('value')
    .eq('restaurant_id', RESTAURANT_ID)
    .eq('key', 'business_name')
    .maybeSingle()
  return data?.value || "Angie's Kebabs & Burgers"
}

export async function generateStaticParams() {
  try {
    const all = await getLocations()
    return all.map(l => ({ store: storeSlug(l.name) }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ store: string }> }): Promise<Metadata> {
  const { store } = await params
  const { loc } = await getStore(store)
  if (!loc) return {}
  const area = areaName(loc.name)
  const late = latestClose(parseHours(loc.opening_hours))
  const title = `Halal Kebabs, HSP & Burgers in ${area}`
  const description = `Order halal kebabs, HSPs and burgers online for pickup from Angie's ${area} at ${loc.address}.${late ? ` Open late until ${late}.` : ''}`
  return {
    title,
    description,
    alternates: { canonical: `/${store}` },
    openGraph: { title: `Angie's Kebabs & Burgers ${area}`, description, url: `${SITE}/${store}`, type: 'website' },
  }
}

export default async function StorePage({ params }: { params: Promise<{ store: string }> }) {
  const { store } = await params
  const [{ loc, others }, popular, businessName] = await Promise.all([getStore(store), getPopular(), getBusinessName()])
  if (!loc) notFound()

  const area = areaName(loc.name)
  const hours = parseHours(loc.opening_hours)
  const rows = groupedHours(hours)
  const late = latestClose(hours)
  const phone = prettyPhone(loc.phone)
  const tel = intlPhone(loc.phone)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${businessName} ${loc.address}`)}`
  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(`${businessName} ${loc.address}`)}&z=15&output=embed`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${SITE}/${store}#restaurant`,
    name: `${businessName} - ${area}`,
    url: `${SITE}/${store}`,
    image: `${SITE}/logo.jpg`,
    telephone: tel,
    address: postalAddress(loc.address || ''),
    servesCuisine: ['Kebabs', 'Burgers', 'Halal', 'Turkish'],
    priceRange: '$$',
    hasMenu: `${SITE}/menu`,
    acceptsReservations: false,
    openingHoursSpecification: hoursSchema(hours),
    potentialAction: {
      '@type': 'OrderAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/menu`, actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'] },
      deliveryMethod: ['http://purl.org/goodrelations/v1#DeliveryModePickUp'],
    },
  }
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: area, item: `${SITE}/${store}` },
    ],
  }
  const json = (o: any) => ({ __html: JSON.stringify(o).replace(/</g, '\\u003c') })

  return (
    <div className="min-h-screen" style={{ background: '#FFFDF5' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={json(schema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={json(breadcrumb)} />
      <StoreNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6" style={{ color: '#6B7280' }} aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span style={{ color: '#1A1A1A' }}>{area}</span>
        </nav>

        {/* Hero */}
        <section className="rounded-3xl p-6 sm:p-10 mb-8" style={{ background: '#FFF8DB', border: '1px solid #F5E6A3' }}>
          <p className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: '#8A6800' }}>{businessName} · {area}</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4" style={{ color: '#1A1A1A' }}>
            Halal kebabs, HSP and burgers in {area}
          </h1>
          <p className="text-base sm:text-lg mb-5" style={{ color: '#4B5563' }}>{loc.address}</p>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <OpenBadge location={{ is_open: loc.is_open, opening_hours: loc.opening_hours }} />
            {late && (
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-white" style={{ color: '#4B5563', border: '1px solid #EBEBEB' }}>
                Open late until {late}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <OrderNowButton locationId={loc.id} locationName={loc.name} />
            {tel && (
              <a href={`tel:${tel}`} className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold bg-white"
                style={{ color: '#1A1A1A', border: '1px solid #E5E7EB' }}>
                Call {phone}
              </a>
            )}
          </div>
        </section>

        {/* Hours + map */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-6" style={{ border: '1px solid #EBEBEB' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#1A1A1A' }}>Opening hours</h2>
            {rows.length ? (
              <dl className="divide-y" style={{ borderColor: '#F3F4F6' }}>
                {rows.map(r => (
                  <div key={r.days} className="flex justify-between py-2.5 text-base">
                    <dt className="font-medium" style={{ color: '#374151' }}>{r.days}</dt>
                    <dd style={{ color: r.time === 'Closed' ? '#B91C1C' : '#1A1A1A' }}>{r.time}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p style={{ color: '#6B7280' }}>Call the store for today&apos;s hours.</p>
            )}
            <p className="text-sm mt-4" style={{ color: '#6B7280' }}>Online orders are for pickup. Delivery is available through Uber Eats and DoorDash.</p>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden flex flex-col" style={{ border: '1px solid #EBEBEB' }}>
            <iframe
              title={`Map of ${businessName} ${area}`}
              src={mapEmbed}
              className="w-full flex-1"
              style={{ minHeight: 240, border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-5 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold" style={{ color: '#1A1A1A' }}>{loc.address}</div>
                {phone && <div className="text-sm" style={{ color: '#6B7280' }}>{phone}</div>}
              </div>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold" style={{ background: '#F5F5F5', color: '#1A1A1A' }}>
                Directions
              </a>
            </div>
          </div>
        </section>

        {/* Popular */}
        {popular.length > 0 && (
          <section className="mb-10">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>Popular in {area}</h2>
              <OrderNowButton locationId={loc.id} locationName={loc.name} label="See full menu" variant="small" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popular.map(item => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #EBEBEB' }}>
                  <div className="aspect-square" style={{ background: '#FFF8DB' }}>
                    {item.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    )}
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-sm sm:text-base" style={{ color: '#1A1A1A' }}>{item.name}</div>
                    {item.price != null && <div className="text-sm mt-0.5" style={{ color: '#6B7280' }}>${Number(item.price).toFixed(2)}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* About this store */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 mb-10" style={{ border: '1px solid #EBEBEB' }}>
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#1A1A1A' }}>Your local kebab shop in {area}</h2>
          <p className="text-base leading-relaxed" style={{ color: '#4B5563' }}>
            {businessName} {area} makes halal kebabs, HSPs (halal snack packs), burgers and loaded chips fresh to order.
            Order online and pick up from {loc.address}{late ? `, open late until ${late} on our latest night` : ''}.
            Ordering here on our own website is the quickest way to get your food — skip the queue and collect when it&apos;s ready.
          </p>
        </section>

        {/* Other stores */}
        {others.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#1A1A1A' }}>Our other stores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {others.map(o => (
                <Link key={o.id} href={`/${storeSlug(o.name)}`}
                  className="bg-white rounded-2xl p-5 flex items-center justify-between hover:shadow-sm transition"
                  style={{ border: '1px solid #EBEBEB' }}>
                  <div>
                    <div className="font-semibold" style={{ color: '#1A1A1A' }}>Angie&apos;s {areaName(o.name)}</div>
                    <div className="text-sm" style={{ color: '#6B7280' }}>{o.address}</div>
                  </div>
                  <span aria-hidden style={{ color: '#B08900' }}>→</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
