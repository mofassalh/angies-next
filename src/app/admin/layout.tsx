'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, UtensilsCrossed, ShoppingBag,
  Users, Settings, LogOut, Menu
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/staff', label: 'Staff', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
      else setUserEmail(data.user.email || '')
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex lg:flex-col`}
        style={{ backgroundColor: '#1A1A1A' }}>
        <div className="p-6" style={{ borderBottom: '1px solid #2a2a2a' }}>
          <h1 className="text-2xl font-bold" style={{ color: '#F5C800' }}>Angie's</h1>
          <p className="text-xs mt-1" style={{ color: '#666' }}>Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium"
              style={{
                backgroundColor: pathname === href ? '#F5C800' : 'transparent',
                color: pathname === href ? '#1A1A1A' : '#aaa',
              }}>
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4" style={{ borderTop: '1px solid #2a2a2a' }}>
          <p className="text-xs mb-3 truncate" style={{ color: '#555' }}>{userEmail}</p>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-sm w-full transition"
            style={{ color: '#aaa' }}
            onMouseOver={e => (e.currentTarget.style.color = '#F5C800')}
            onMouseOut={e => (e.currentTarget.style.color = '#aaa')}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-4 py-3 flex items-center lg:hidden"
          style={{ backgroundColor: '#1A1A1A', borderBottom: '1px solid #2a2a2a' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ color: '#aaa' }}>
            <Menu size={22} />
          </button>
          <h1 className="font-bold ml-3" style={{ color: '#F5C800' }}>Angie's Admin</h1>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
