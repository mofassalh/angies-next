'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { RESTAURANT_ID } from '@/lib/restaurant'
import LocationPopup from '@/components/LocationPopup'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FeaturedItems from '@/components/FeaturedItems'
import PromoSection from '@/components/PromoSection'
import Footer from '@/components/Footer'

export default function Home() {
  const [showLocationPopup, setShowLocationPopup] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [locationCount, setLocationCount] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('selectedLocationName')
    if (saved) setSelectedLocation(saved)

    // Load location count
    const supabase = createClient()
    supabase
      .from('locations')
      .select('id, name')
      .eq('is_active', true)
      .eq('restaurant_id', RESTAURANT_ID)
      .then(({ data }) => {
        if (!data) return
        setLocationCount(data.length)
        // If only 1 location, auto-select it
        if (data.length === 1 && !localStorage.getItem('selectedLocationId')) {
          localStorage.setItem('selectedLocationId', data[0].id)
          localStorage.setItem('selectedLocationName', data[0].name)
          setSelectedLocation(data[0].name)
        }
      })
  }, [])

  const handleOrderClick = () => {
    const locationId = localStorage.getItem('selectedLocationId')
    if (locationId) {
      router.push('/menu')
    } else if (locationCount === 1) {
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
        onLocationClick={() => locationCount === 1 ? null : setShowLocationPopup(true)}
      />
      <HeroSection onOrderClick={handleOrderClick} />
      <FeaturedItems onOrderClick={handleOrderClick} />
      <PromoSection onOrderClick={handleOrderClick} />
      <Footer />
      {showLocationPopup && locationCount !== 1 && (
        <LocationPopup
          onSelect={handleLocationSelect}
          onClose={() => setShowLocationPopup(false)}
        />
      )}
    </main>
  )
}
