'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const LOCATIONS = [
  {
    id: 'st-albans',
    name: 'St Albans',
    address: '66 Kings Rd, St Albans VIC 3021',
    hours: 'Open until 11PM',
    phone: '(03) 9000 0001',
  },
  {
    id: 'fitzroy-north',
    name: 'Fitzroy North',
    address: '123 Main St, Fitzroy North VIC 3068',
    hours: 'Open until 10PM',
    phone: '(03) 9000 0002',
  },
  {
    id: 'ascot-vale',
    name: 'Ascot Vale',
    address: '2 Epsom Rd, Ascot Vale VIC 3032',
    hours: 'Open until 11PM',
    phone: '(03) 9000 0003',
  },
]

export default function Home() {
  const [selected, setSelected] = useState<string | null>(null)
  const [showOrderType, setShowOrderType] = useState(false)
  const router = useRouter()

  const handleLocationSelect = (loc: typeof LOCATIONS[0]) => {
    setSelected(loc.id)
    localStorage.setItem('selectedLocationId', loc.id)
    localStorage.setItem('selectedLocationName', loc.name)
    setShowOrderType(true)
  }

  const handleOrderType = (type: 'pickup' | 'delivery') => {
    localStorage.setItem('orderType', type)
    if (type === 'pickup') {
      router.push('/menu')
    } else {
      router.push('/delivery')
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFDF5' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
            style={{ backgroundColor: '#F5C800', color: '#1A1A1A' }}>A</div>
          <div>
            <h1 className="font-bold text-lg" style={{ color: '#1A1A1A' }}>Angie's</h1>
            <p className="text-xs" style={{ color: '#888' }}>Kebabs & Burgers</p>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="text-center px-6 py-12">
        <h2 className="text-4xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
          Fresh & <span style={{ color: '#F5C800' }}>Flavourful</span>
        </h2>
        <p className="text-lg" style={{ color: '#666' }}>Select your nearest location to start ordering</p>
      </div>

      {/* Location Cards */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LOCATIONS.map(loc => (
            <button key={loc.id} onClick={() => handleLocationSelect(loc)}
              className="text-left rounded-2xl p-6 transition-all"
              style={{
                backgroundColor: selected === loc.id ? '#F5C800' : '#fff',
                border: selected === loc.id ? '2px solid #F5C800' : '2px solid #e5e5e5',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
              }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 font-bold"
                style={{
                  backgroundColor: selected === loc.id ? '#1A1A1A' : '#F5C800',
                  color: selected === loc.id ? '#F5C800' : '#1A1A1A'
                }}>
                {loc.name[0]}
              </div>
              <h3 className="font-bold text-lg mb-1" style={{ color: '#1A1A1A' }}>{loc.name}</h3>
              <p className="text-sm mb-3" style={{ color: selected === loc.id ? '#1A1A1A' : '#888' }}>{loc.address}</p>
              <div className="flex items-center gap-1 text-xs font-medium"
                style={{ color: selected === loc.id ? '#1A1A1A' : '#22c55e' }}>
                <span className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: selected === loc.id ? '#1A1A1A' : '#22c55e' }}></span>
                {loc.hours}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Order Type Popup */}
      {showOrderType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-sm mx-4 rounded-3xl p-8 bg-white shadow-2xl">
            <h3 className="text-2xl font-bold text-center mb-2" style={{ color: '#1A1A1A' }}>How would you like to order?</h3>
            <p className="text-center text-sm mb-8" style={{ color: '#888' }}>
              {LOCATIONS.find(l => l.id === selected)?.name}
            </p>
            <div className="space-y-3">
              <button onClick={() => handleOrderType('pickup')}
                className="w-full py-4 rounded-2xl font-bold text-lg transition"
                style={{ backgroundColor: '#F5C800', color: '#1A1A1A' }}>
                🏪 Pickup
              </button>
              <button onClick={() => handleOrderType('delivery')}
                className="w-full py-4 rounded-2xl font-bold text-lg transition"
                style={{ backgroundColor: '#1A1A1A', color: '#fff' }}>
                🛵 Delivery
              </button>
            </div>
            <button onClick={() => setShowOrderType(false)}
              className="w-full mt-4 text-sm py-2"
              style={{ color: '#aaa' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
