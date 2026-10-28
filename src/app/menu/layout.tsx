import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Menu',
  description: "Order halal kebabs, HSPs, burgers and more online for pickup from Angie's Kebabs & Burgers in St Albans, Fitzroy North and Ascot Vale.",
  alternates: { canonical: '/menu' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
