'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase'
import { Save, LogOut, Camera } from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({ full_name:'', phone:'', address:'' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [orderStats, setOrderStats] = useState({ total:0, spent:0, favourite:'' })
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login?redirect=/profile'); return }
      setUser(data.user)
      const [{ data: profileData }, { data: ordersData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', data.user.id).single(),
        supabase.from('orders').select('*').eq('user_id', data.user.id),
      ])
      if (profileData) setProfile({ full_name: profileData.full_name||'', phone: profileData.phone||'', address: profileData.address||'' })
      if (ordersData && ordersData.length > 0) {
        const spent = ordersData.reduce((s: number, o: any) => s + o.total, 0)
        // favourite item
        const itemCount: Record<string, number> = {}
        ordersData.forEach((o: any) => {
          (o.items || []).forEach((item: any) => {
            itemCount[item.name] = (itemCount[item.name] || 0) + item.quantity
          })
        })
        const favourite = Object.entries(itemCount).sort((a,b) => b[1]-a[1])[0]?.[0] || ''
        setOrderStats({ total: ordersData.length, spent, favourite })
      }
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('profiles').upsert({ id: user.id, ...profile, updated_at: new Date().toISOString() })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <main className="min-h-screen bg-gray-50">
      <Navbar selectedLocation={null} onLocationClick={() => {}} />
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading...</div>
      </div>
    </main>
  )

  const initials = profile.full_name ? profile.full_name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) : user?.email?.[0]?.toUpperCase() || '?'

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar selectedLocation={null} onLocationClick={() => {}} />
      <div className="pt-16 max-w-lg mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily:'var(--font-display)'}}>My Profile</h1>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Avatar + name */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-4 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
            style={{background:'var(--color-primary)', color:'#1a1a1a'}}>
            {initials}
          </div>
          <div>
            <div className="font-bold text-gray-900 text-lg">{profile.full_name || 'Your Name'}</div>
            <div className="text-sm text-gray-400">{user?.email}</div>
          </div>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-gray-900">{orderStats.total}</div>
            <div className="text-xs text-gray-400 mt-1">Orders</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-gray-900">${orderStats.spent.toFixed(0)}</div>
            <div className="text-xs text-gray-400 mt-1">Total Spent</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <div className="text-lg font-bold text-gray-900 truncate">{orderStats.favourite || '—'}</div>
            <div className="text-xs text-gray-400 mt-1">Fav Item</div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-4">
          <h3 className="font-semibold text-gray-900 mb-4">Personal Info</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Full Name</label>
              <input value={profile.full_name}
                onChange={e => setProfile(p => ({...p, full_name: e.target.value}))}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{border:'1px solid #e5e5e5', color:'#1a1a1a'}} />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Phone</label>
              <input value={profile.phone}
                onChange={e => setProfile(p => ({...p, phone: e.target.value}))}
                placeholder="+61 4XX XXX XXX"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{border:'1px solid #e5e5e5', color:'#1a1a1a'}} />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Default Address</label>
              <input value={profile.address}
                onChange={e => setProfile(p => ({...p, address: e.target.value}))}
                placeholder="123 Main St, Melbourne"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{border:'1px solid #e5e5e5', color:'#1a1a1a'}} />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="mt-5 w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            style={{background: saved ? '#22c55e' : 'var(--color-primary)', color: saved ? 'white' : '#1a1a1a'}}>
            <Save size={16} />
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
          <div className="space-y-2">
            <Link href="/orders" className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-sm text-gray-700">🧾 My Orders</span>
              <span className="text-gray-300">›</span>
            </Link>
            <Link href="/menu" className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-sm text-gray-700">🍔 Browse Menu</span>
              <span className="text-gray-300">›</span>
            </Link>
            <Link href="/delivery" className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-sm text-gray-700">🛵 Delivery Options</span>
              <span className="text-gray-300">›</span>
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}
