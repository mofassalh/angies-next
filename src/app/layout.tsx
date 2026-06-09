import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { getSettings } from '@/lib/settings'
import CookieBanner from '@/components/CookieBanner'

const GA_ID = 'G-RD2J6J2DMZ'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const businessName = settings.business_name || "Angie's Kebabs & Burgers"
  const description = settings.tagline || 'Order online for pickup or delivery from Angie\'s Kebabs & Burgers. Locations in St Albans, Fitzroy North & Ascot Vale.'

  return {
    title: {
      default: businessName,
      template: `%s | ${businessName}`,
    },
    description,
    keywords: ['kebab', 'burger', 'online order', 'St Albans', 'Fitzroy North', 'Ascot Vale', 'pickup', 'delivery'],
    icons: { icon: '/logo.jpg', apple: '/logo.jpg' },
    openGraph: {
      title: businessName,
      description,
      type: 'website',
      url: 'https://angiesknb.com',
      siteName: businessName,
    },
    twitter: {
      card: 'summary_large_image',
      title: businessName,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()
  const primaryColor = settings.primary_color || '#F5C800'
  const businessName = settings.business_name || "Angie's Kebabs & Burgers"

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: businessName,
    url: 'https://angiesknb.com',
    servesCuisine: ['Kebab', 'Burger'],
    hasMenu: 'https://angiesknb.com/menu',
    location: [
      { '@type': 'Place', name: 'St Albans', address: { '@type': 'PostalAddress', addressLocality: 'St Albans', addressCountry: 'AU' } },
      { '@type': 'Place', name: 'Fitzroy North', address: { '@type': 'PostalAddress', addressLocality: 'Fitzroy North', addressCountry: 'AU' } },
      { '@type': 'Place', name: 'Ascot Vale', address: { '@type': 'PostalAddress', addressLocality: 'Ascot Vale', addressCountry: 'AU' } },
    ],
  }

  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --color-primary: ${primaryColor};
            --font-display: 'Georgia', serif;
          }
        `}</style>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
