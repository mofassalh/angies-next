import type { Metadata } from 'next'
import './globals.css'
import { getSettings } from '@/lib/settings'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: settings.business_name || 'Our Restaurant',
    description: settings.tagline || 'Order online for pickup or delivery',
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()
  const primaryColor = settings.primary_color || '#F5C800'

  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --color-primary: ${primaryColor};
            --font-display: 'Georgia', serif;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
