'use client'

import { useState } from 'react'
import LocationPopup from '@/components/LocationPopup'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FeaturedItems from '@/components/FeaturedItems'
import PromoSection from '@/components/PromoSection'
import Footer from '@/components/Footer'

export default function Home() {
  const [showLocationPopup, setShowLocationPopup] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  const handleLocationSelect = (locationId: string, locationName: string) => {
    setSelectedLocation(locationName)
    setShowLocationPopup(false)
    localStorage.setItem('selectedLocationId', locationId)
    localStorage.setItem('selectedLocationName', locationName)
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar
        selectedLocation={selectedLocation}
        onLocationClick={() => setShowLocationPopup(true)}
      />
      <HeroSection onOrderClick={() => setShowLocationPopup(true)} />
      <FeaturedItems />
      <PromoSection onOrderClick={() => setShowLocationPopup(true)} />
      <Footer />
      {showLocationPopup && (
        <LocationPopup
          onSelect={handleLocationSelect}
          onClose={() => setShowLocationPopup(false)}
        />
      )}
    </main>
  )
}
