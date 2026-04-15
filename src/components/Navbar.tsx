'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import CartCount from '@/components/CartCount'

interface NavbarProps {
  selectedLocation: string | null
  onLocationClick: () => void
}

export default function Navbar({ selectedLocation, onLocationClick }: NavbarProps) {
  const [user, setUser] = useState<any>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setDropdownOpen(false)
    router.push('/')
  }

  const getInitial = () => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name[0].toUpperCase()
    if (user?.email) return user.email[0].toUpperCase()
    return '?'
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="Angie's" width={44} height={44} className="rounded-full object-cover" />
            <span className="font-bold text-lg" style={{fontFamily: 'var(--font-display)'}}>Angie's</span>
          </Link>
          <button onClick={onLocationClick} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all text-sm font-medium">
            <svg className="w-4 h-4" style={{color: 'var(--color-primary)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-gray-700">{selectedLocation || 'Select Location'}</span>
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            
            <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <CartCount />
            </Link>
            {user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden" style={{background: 'var(--color-primary)', color: '#1A1A1A'}}>
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} className="w-9 h-9 rounded-full object-cover" alt="avatar" />
                  ) : getInitial()}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-11 bg-white rounded-2xl shadow-xl border border-gray-100 w-48 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="text-xs text-gray-400">Signed in as</div>
                      <div className="text-sm font-semibold text-gray-800 truncate">{user.email}</div>
                    </div>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>My Orders</Link>
                    <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-full transition-all hover:opacity-90" style={{background: 'var(--color-primary)', color: '#1A1A1A'}}>Sign In</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
