'use client'
import { useRouter } from 'next/navigation'

const PARTNERS = [
  {
    name: 'Uber Eats',
    logo: '🛵',
    color: '#06C167',
    url: 'https://www.ubereats.com/au/store/angies-kebabs-burgers',
  },
  {
    name: 'DoorDash',
    logo: '🔴',
    color: '#FF3008',
    url: 'https://www.doordash.com',
  },
  {
    name: 'Menulog',
    logo: '🟠',
    color: '#FF8000',
    url: 'https://www.menulog.com.au',
  },
]

export default function DeliveryPage() {
  const router = useRouter()
  const location = typeof window !== 'undefined' ? localStorage.getItem('selectedLocationName') : ''

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFFDF5' }}>
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 bg-white shadow-sm">
        <button onClick={() => router.back()} style={{ color: '#888' }}>← Back</button>
        <div>
          <h1 className="font-bold" style={{ color: '#1A1A1A' }}>Order Delivery</h1>
          <p className="text-xs" style={{ color: '#888' }}>{location}</p>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full px-6 py-12">
        <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: '#1A1A1A' }}>Choose a delivery partner</h2>
        <p className="text-center text-sm mb-8" style={{ color: '#888' }}>You'll be redirected to the partner's app</p>

        <div className="space-y-3">
          {PARTNERS.map(partner => (
            <a key={partner.name} href={partner.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-5 rounded-2xl bg-white transition"
              style={{ border: '2px solid #e5e5e5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center gap-4">
                <span className="text-3xl">{partner.logo}</span>
                <span className="font-bold text-lg" style={{ color: '#1A1A1A' }}>{partner.name}</span>
              </div>
              <span style={{ color: '#aaa' }}>→</span>
            </a>
          ))}
        </div>

        <button onClick={() => router.push('/menu')}
          className="w-full mt-8 py-3 rounded-2xl text-sm font-medium"
          style={{ border: '2px solid #e5e5e5', color: '#555' }}>
          Or order for pickup instead
        </button>
      </div>
    </div>
  )
}
