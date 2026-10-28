import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: "The story of Angie's Kebabs & Burgers — halal kebabs and burgers in Melbourne, with stores in St Albans, Fitzroy North and Ascot Vale.",
  alternates: { canonical: '/about' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
