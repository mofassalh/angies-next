import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Delivery',
  description: "Get Angie's Kebabs & Burgers delivered in Melbourne — see delivery options for St Albans, Fitzroy North and Ascot Vale.",
  alternates: { canonical: '/delivery' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
