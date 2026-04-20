'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LocationPopup from '@/components/LocationPopup'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FeaturedItems from '@/components/FeaturedItems'
import PromoSection from '@/components/PromoSection'
import Footer from '@/components/Footer'

export default function Home() {
  const [showLocationPopup, setShowLocationPopup] = useState(false)
  const [showOrderType, setShowOrderType] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('selectedLocationName')
    if (saved) setSelectedLocation(saved)
  }, [])

  const handleOrderClick = () => {
    const locationId = localStorage.getItem('selectedLocationId')
    if (locationId) {
      setShowOrderType(true)
    } else {
      setShowLocationPopup(true)
    }
  }

  const handleLocationSelect = (locationId: string, locationName: string) => {
    setSelectedLocation(locationName)
    setShowLocationPopup(false)
    localStorage.setItem('selectedLocationId', locationId)
    localStorage.setItem('selectedLocationName', locationName)
    setShowOrderType(true)
  }

  const handleOrderType = (type: 'pickup' | 'delivery') => {
    localStorage.setItem('orderType', type)
    setShowOrderType(false)
    if (type === 'pickup') {
      router.push('/menu')
    } else {
      router.push('/delivery')
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar
        selectedLocation={selectedLocation}
        onLocationClick={() => setShowLocationPopup(true)}
      />
      <HeroSection onOrderClick={handleOrderClick} />
      <FeaturedItems onOrderClick={handleOrderClick} />
      <PromoSection onOrderClick={handleOrderClick} />
      <Footer />

      {showLocationPopup && (
        <LocationPopup
          onSelect={handleLocationSelect}
          onClose={() => setShowLocationPopup(false)}
        />
      )}

      {showOrderType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3"
                style={{ background: '#FFF3B0' }}>🛍️</div>
              <h2 className="text-xl font-bold text-gray-900">How would you like to order?</h2>
              <p className="text-sm text-gray-500 mt-1">{selectedLocation}</p>
            </div>
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
              className="w-full mt-4 text-sm py-2 text-gray-400">
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
