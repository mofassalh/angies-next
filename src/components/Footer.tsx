'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function Footer() {
  const [locations, setLocations] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})

  useEffect(() => {
    const supabase = createClient()
    supabase.from('locations').select('*').eq('is_active', true).order('name').then(({ data }) => {
      if (data) setLocations(data)
    })
    supabase.from('settings').select('*').then(({ data }) => {
      const map: any = {}
      data?.forEach((r: any) => { map[r.key] = r.value })
      setSettings(map)
    })
  }, [])

  const businessName = settings.business_name || "Angie's"
  const tagline = settings.tagline || 'Fresh kebabs and gourmet burgers across Melbourne. Made with love, served with pride.'
  const facebook = settings.facebook_url || '#'
  const instagram = settings.instagram_url || '#'
  const copyright = settings.copyright || `© ${new Date().getFullYear()} Angie's Kebabs & Burgers. All rights reserved.`

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={businessName} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background: 'var(--color-primary)'}}>
                  <span className="text-white font-bold text-sm">{businessName[0]}</span>
                </div>
              )}
              <span className="font-bold text-lg" style={{fontFamily: 'var(--font-display)'}}>{businessName}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{tagline}</p>
            <div className="flex gap-3 mt-6">
              <a href={facebook} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
                <span className="text-sm">f</span>
              </a>
              <a href={instagram} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
                <span className="text-sm">ig</span>
              </a>
            </div>
          </div>

          {/* Locations — dynamic */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Our Locations</h4>
            {locations.length === 0 ? (
              <ul className="space-y-3 text-sm text-gray-400">
                <li><div className="font-medium text-gray-300">St Albans</div></li>
                <li><div className="font-medium text-gray-300">Fitzroy North</div></li>
                <li><div className="font-medium text-gray-300">Ascot Vale</div></li>
              </ul>
            ) : (
              <ul className="space-y-3 text-sm text-gray-400">
                {locations.map(loc => (
                  <li key={loc.id}>
                    <div className="font-medium text-gray-300">{loc.name}</div>
                    {loc.address && <div>{loc.address}</div>}
                    {loc.phone && <div>{loc.phone}</div>}
                    {loc.hours && <div className="text-xs text-gray-500 mt-0.5">{loc.hours}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/menu" className="hover:text-orange-400 transition-colors">Menu</Link></li>
              <li><Link href="/delivery" className="hover:text-orange-400 transition-colors">Delivery</Link></li>
              <li><Link href="/login" className="hover:text-orange-400 transition-colors">Sign In</Link></li>
              <li><Link href="/orders" className="hover:text-orange-400 transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Opening Hours</h4>
            {settings.opening_hours ? (
              <p className="text-sm text-gray-400 whitespace-pre-line">{settings.opening_hours}</p>
            ) : (
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex justify-between"><span>Mon – Thu</span><span>11am – 10pm</span></li>
                <li className="flex justify-between"><span>Fri – Sat</span><span>11am – 11pm</span></li>
                <li className="flex justify-between"><span>Sunday</span><span>12pm – 10pm</span></li>
              </ul>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>{copyright}</div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
