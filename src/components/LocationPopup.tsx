'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

interface Location {
  id: string
  name: string
  suburb: string
  postcode: string
  address: string
  phone: string
}

interface LocationPopupProps {
  onSelect: (locationId: string, locationName: string) => void
  onClose: () => void
}

export default function LocationPopup({ onSelect, onClose }: LocationPopupProps) {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLocations = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('name')
      if (!error && data) setLocations(data)
      setLoading(false)
    }
    fetchLocations()
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 z-10">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3" style={{background: '#FFF3B0'}}>
            📍
          </div>
          <h2 className="text-xl font-bold text-gray-900" style={{fontFamily: 'var(--font-display)'}}>
            Choose Your Location
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Select a location to see the menu and order
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => onSelect(location.id, location.name)}
                className="w-full text-left p-4 rounded-2xl border-2 border-gray-100 hover:border-yellow-400 hover:bg-yellow-50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-yellow-700 transition-colors">
                      {location.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">{location.address}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{location.phone}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-gray-200 group-hover:border-yellow-400 flex items-center justify-center transition-all flex-shrink-0" style={{}}>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-yellow-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <p className="text-xs text-center text-gray-400 mt-4">
          Menu and prices may vary by location
        </p>
      </div>
    </div>
  )
}
