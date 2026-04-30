import type { Metadata } from 'next'
import './globals.css'
import { getSettings } from '@/lib/settings'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: settings.business_name || "Angie's Kebabs & Burgers",
    description: settings.tagline || 'Fresh kebabs and burgers across Melbourne',
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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-RD2J6J2DMZ"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-RD2J6J2DMZ');
        ` }} />
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
