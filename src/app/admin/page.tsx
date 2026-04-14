'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { ShoppingBag, UtensilsCrossed, Users, TrendingUp } from 'lucide-react'

const stats = [
  { label: 'Total Orders', value: '0', icon: ShoppingBag, color: '#4a9eff' },
  { label: 'Menu Items', value: '0', icon: UtensilsCrossed, color: '#22c55e' },
  { label: 'Staff Members', value: '0', icon: Users, color: '#a855f7' },
  { label: "Today's Revenue", value: '$0', icon: TrendingUp, color: '#F5C800' },
]

export default function AdminDashboard() {
  const [email, setEmail] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email || '')
    })
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>Dashboard</h2>
        <p className="mt-1 text-sm" style={{ color: '#888' }}>Welcome back, {email}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl p-6"
            style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm" style={{ color: '#888' }}>{label}</span>
              <Icon size={20} style={{ color }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: '#1A1A1A' }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl p-6"
          style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5' }}>
          <h3 className="font-semibold mb-4" style={{ color: '#1A1A1A' }}>Recent Orders</h3>
          <p className="text-sm" style={{ color: '#bbb' }}>No orders yet</p>
        </div>
        <div className="rounded-2xl p-6"
          style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5' }}>
          <h3 className="font-semibold mb-4" style={{ color: '#1A1A1A' }}>Locations</h3>
          {['St Albans', 'Fitzroy North', 'Ascot Vale'].map(loc => (
            <div key={loc} className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#22c55e' }}></span>
              <span className="text-sm" style={{ color: '#444' }}>{loc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
