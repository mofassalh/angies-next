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
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('selectedLocationName')
    if (saved) setSelectedLocation(saved)
  }, [])

  const handleOrderClick = () => {
    const locationId = localStorage.getItem('selectedLocationId')
    if (locationId) {
      router.push('/menu')
    } else {
      setShowLocationPopup(true)
    }
  }

  const handleLocationSelect = (locationId: string, locationName: string) => {
    setSelectedLocation(locationName)
    setShowLocationPopup(false)
    localStorage.setItem('selectedLocationId', locationId)
    localStorage.setItem('selectedLocationName', locationName)
    router.push('/menu')
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


    </main>
  )
}
