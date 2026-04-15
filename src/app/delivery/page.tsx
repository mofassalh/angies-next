'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

const PARTNERS = [
  {
    name: 'Uber Eats',
    emoji: '🛵',
    color: '#06C167',
    url: 'https://www.ubereats.com/au/store/angies-kebabs-burgers',
  },
  {
    name: 'DoorDash',
    emoji: '🔴',
    color: '#FF3008',
    url: 'https://www.doordash.com',
  },
  {
    name: 'Menulog',
    emoji: '🟠',
    color: '#FF8000',
    url: 'https://www.menulog.com.au',
  },
]

export default function DeliveryPage() {
  const router = useRouter()
  const [location, setLocation] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('selectedLocationName')
    if (saved) setLocation(saved)
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar selectedLocation={location || null} onLocationClick={() => {}} />
      <div className="pt-16 max-w-md mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{fontFamily: 'var(--font-display)'}}>
          Delivery
        </h1>
        <p className="text-gray-500 mb-8">Choose a delivery partner to place your order</p>

        <div className="space-y-3">
          {PARTNERS.map(partner => (
            <a key={partner.name} href={partner.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{partner.emoji}</span>
                <span className="font-bold text-lg text-gray-900">{partner.name}</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>

        <button onClick={() => router.push('/menu')}
          className="w-full mt-6 py-3 rounded-full font-semibold border-2 transition-all hover:bg-orange-50"
          style={{borderColor: 'var(--color-primary)', color: 'var(--color-primary)'}}>
          Order for Pickup instead
        </button>
      </div>
    </main>
  )
}
