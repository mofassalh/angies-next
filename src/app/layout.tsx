import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Angie's Kebabs & Burgers",
  description: 'Fresh kebabs and burgers across Melbourne',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
