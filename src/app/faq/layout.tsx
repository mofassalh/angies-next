import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ',
  description: "Answers to common questions about ordering, pickup, delivery, halal food and loyalty points at Angie's Kebabs & Burgers.",
  alternates: { canonical: '/faq' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
