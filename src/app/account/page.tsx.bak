'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase'
import { RESTAURANT_ID } from '@/lib/restaurant'
import { Save, LogOut, Star, Package, User, ChevronDown, ChevronUp } from 'lucide-react'

const statusColor: Record<string, string> = {
  pending:'#F59E0B', confirmed:'#3B82F6', preparing:'#8B5CF6',
  ready:'#10B981', delivered:'#10B981', cancelled:'#EF4444',
}
const statusLabel: Record<string, string> = {
  pending:'Pending', confirmed:'Confirmed', preparing:'Preparing',
  ready:'Ready', delivered:'Delivered', cancelled:'Cancelled',
}

export default function AccountPage() {
  const [tab, setTab] = useState<'profile' | 'orders'>('profile')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({ full_name: '', phone: '', address: '' })
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [loyaltySettings, setLoyaltySettings] = useState<any>(null)
  const [orderStats, setOrderStats] = useState({ total: 0, spent: 0, favourite: '' })
  const [orders, setOrders] = useState<any[]>([])
  const [ratings, setRatings] = useState<Record<string, any>>({})
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [ratingModal, setRatingModal] = useState<{ orderId: string; orderNumber: string } | null>(null)
  const [starHover, setStarHover] = useState(0)
  const [starSelected, setStarSelected] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for tab param
    const params = new URLSearchParams(window.location.search)
    if (params.get('tab') === 'orders') setTab('orders')

    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login?redirect=/account'); return }
      setUser(data.user)

      const [
        { data: profileData },
        { data: ordersData },
        { data: ratingsData },
        { data: lpData },
        { data: lsData },
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', data.user.id).single(),
        supabase.from('orders').select('*').eq('user_id', data.user.id).eq('restaurant_id', RESTAURANT_ID).order('created_at', { ascending: false }),
        supabase.from('order_ratings').select('*').eq('user_id', data.user.id),
        supabase.from('loyalty_points').select('points').eq('customer_id', data.user.id).eq('restaurant_id', RESTAURANT_ID).single(),
        supabase.from('loyalty_settings').select('*').eq('restaurant_id', RESTAURANT_ID).single(),
      ])

      if (profileData) setProfile({ full_name: profileData.full_name || '', phone: profileData.phone || '', address: profileData.address || '' })
      if (lpData) setLoyaltyPoints(lpData.points || 0)
      if (lsData) setLoyaltySettings(lsData)

      if (ordersData) {
        setOrders(ordersData)
        const spent = ordersData.reduce((s: number, o: any) => s + o.total, 0)
        const itemCount: Record<string, number> = {}
        ordersData.forEach((o: any) => {
          (o.items || []).forEach((item: any) => {
            itemCount[item.name] = (itemCount[item.name] || 0) + item.quantity
          })
        })
        const favourite = Object.entries(itemCount).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
        setOrderStats({ total: ordersData.length, spent, favourite })
      }

      if (ratingsData) {
        const map: Record<string, any> = {}
        ratingsData.forEach((r: any) => { map[r.order_id] = r })
        setRatings(map)
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
    setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const openRating = (order: any) => {
    const existing = ratings[order.id]
    setStarSelected(existing?.rating || 0)
    setComment(existing?.comment || '')
    setStarHover(0)
    setRatingModal({ orderId: order.id, orderNumber: order.order_number })
  }

  const submitRating = async () => {
    if (!starSelected || !ratingModal) return
    setSubmitting(true)
    const supabase = createClient()
    const { data: { user: u } } = await supabase.auth.getUser()
    await supabase.from('order_ratings').upsert({
      order_id: ratingModal.orderId,
      user_id: u!.id,
      rating: starSelected,
      comment,
    }, { onConflict: 'order_id' })
    setRatings(prev => ({ ...prev, [ratingModal.orderId]: { order_id: ratingModal.orderId, rating: starSelected, comment } }))
    setSubmitting(false)
    setRatingModal(null)
  }

  const formatDate = (str: string) => new Date(str).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?'

  const pointsValue = loyaltySettings ? (loyaltyPoints / loyaltySettings.points_per_dollar_value).toFixed(2) : '0.00'

  if (loading) return (
    <main className="min-h-screen bg-gray-50">
      <Navbar selectedLocation={null} onLocationClick={() => {}} />
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar selectedLocation={null} onLocationClick={() => {}} />

      <div className="pt-16 max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
            style={{ background: 'var(--color-primary)', color: '#1a1a1a' }}>
            {initials}
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-900 text-xl">{profile.full_name || 'Welcome!'}</div>
            <div className="text-sm text-gray-400">{user?.email}</div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={15} /> Logout
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-3 border border-gray-100 text-center">
            <div className="text-xl font-bold text-gray-900">{orderStats.total}</div>
            <div className="text-xs text-gray-400 mt-0.5">Orders</div>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-gray-100 text-center">
            <div className="text-xl font-bold text-gray-900">${orderStats.spent.toFixed(0)}</div>
            <div className="text-xs text-gray-400 mt-0.5">Spent</div>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-gray-100 text-center col-span-2"
            style={{ background: 'linear-gradient(135deg, #FFFBE6, #FFF9E0)', border: '1px solid #E8C84A' }}>
            <div className="text-xl font-bold" style={{ color: '#8A6800' }}>⭐ {loyaltyPoints}</div>
            <div className="text-xs mt-0.5" style={{ color: '#B8960A' }}>Points · Worth ${pointsValue}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'orders', label: `Orders (${orderStats.total})`, icon: Package },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id as any)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: tab === id ? '#1a1a1a' : 'white',
                color: tab === id ? 'white' : '#666',
                border: '1px solid #e5e5e5'
              }}>
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Personal Info</h3>
                {!editing && (
                  <button onClick={() => setEditing(true)}
                    className="text-sm px-4 py-1.5 rounded-xl font-medium"
                    style={{ border: '1px solid #e5e5e5', color: '#555' }}>
                    Edit
                  </button>
                )}
              </div>
              {editing ? (
                <div className="space-y-3">
                  {[
                    { key: 'full_name', label: 'Full Name', placeholder: 'Your full name' },
                    { key: 'phone', label: 'Phone', placeholder: '+61 4XX XXX XXX' },
                    { key: 'address', label: 'Default Address', placeholder: '123 Main St, Melbourne' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                      <input value={(profile as any)[key]}
                        onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{ border: '1px solid #e5e5e5', color: '#1a1a1a' }} />
                    </div>
                  ))}
                  <div className="flex gap-3 mt-2">
                    <button onClick={() => setEditing(false)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                      style={{ border: '1px solid #e5e5e5', color: '#555' }}>Cancel</button>
                    <button onClick={handleSave} disabled={saving}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                      style={{ background: saved ? '#22c55e' : 'var(--color-primary)', color: saved ? 'white' : '#1a1a1a' }}>
                      <Save size={14} />
                      {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {[
                    { label: 'Full Name', value: profile.full_name },
                    { label: 'Phone', value: profile.phone },
                    { label: 'Address', value: profile.address },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2" style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <span className="text-sm text-gray-400">{label}</span>
                      <span className="text-sm font-medium text-gray-900">{value || '—'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Loyalty card */}
            {loyaltySettings?.is_active && (
              <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #FFFBE6, #FFF3B0)', border: '1px solid #E8C84A' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-lg" style={{ color: '#7A5F00' }}>⭐ Loyalty Points</div>
                  <div className="text-2xl font-black" style={{ color: '#D4A900' }}>{loyaltyPoints}</div>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span style={{ color: '#B8960A' }}>Worth ${pointsValue} in discounts</span>
                  <span style={{ color: '#B8960A' }}>Earn {loyaltySettings.points_per_dollar} pt per $1</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F5E080' }}>
                  <div className="h-2 rounded-full transition-all"
                    style={{
                      background: '#D4A900',
                      width: `${Math.min(100, (loyaltyPoints / loyaltySettings.min_points_redeem) * 100)}%`
                    }} />
                </div>
                <div className="text-xs mt-2" style={{ color: '#B8960A' }}>
                  {loyaltyPoints >= loyaltySettings.min_points_redeem
                    ? '✅ You can redeem points on your next order!'
                    : `${loyaltySettings.min_points_redeem - loyaltyPoints} more points to unlock redemption`}
                </div>
              </div>
            )}

            {/* Quick links */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
              <div className="space-y-1">
                {[
                  { href: '/menu', label: '🍔 Browse Menu' },
                  { href: '/delivery', label: '🛵 Delivery Options' },
                ].map(({ href, label }) => (
                  <Link key={href} href={href}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <span className="text-sm text-gray-700">{label}</span>
                    <span className="text-gray-300">›</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <div className="text-5xl mb-4">🧾</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders yet</h3>
                <p className="text-gray-400 mb-6 text-sm">Your order history will appear here</p>
                <Link href="/menu" className="px-6 py-2.5 rounded-full text-sm font-semibold inline-block"
                  style={{ background: 'var(--color-primary)', color: '#1a1a1a' }}>
                  Browse Menu
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => {
                  const existingRating = ratings[order.id]
                  const isExpanded = expandedId === order.id
                  return (
                    <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                      <div className="p-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-sm">{order.order_number}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white"
                              style={{ background: statusColor[order.status] || '#6B7280' }}>
                              {statusLabel[order.status] || order.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
                            {isExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{order.order_type === 'delivery' ? '🛵' : '🏃'} {order.location}</span>
                          <span>{formatDate(order.created_at)}</span>
                        </div>
                        {existingRating && (
                          <div className="flex items-center gap-1 mt-1.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={11} fill={s <= existingRating.rating ? '#F5C800' : 'none'}
                                stroke={s <= existingRating.rating ? '#F5C800' : '#ccc'} />
                            ))}
                          </div>
                        )}
                      </div>
                      {isExpanded && (
                        <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                          <div className="space-y-1.5 mb-3">
                            {(order.items || []).map((item: any, i: number) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.name} ×{item.quantity}</span>
                                <span className="font-medium text-gray-900">${item.lineTotal.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          {order.notes && <div className="text-xs text-gray-400 mb-3">📝 {order.notes}</div>}
                          {order.status === 'delivered' && (
                            <button onClick={() => openRating(order)}
                              className="w-full py-2 rounded-xl text-sm font-semibold transition-all"
                              style={{
                                border: `1px solid ${existingRating ? '#F5C800' : '#e5e5e5'}`,
                                background: existingRating ? '#FFFBE6' : 'white',
                                color: existingRating ? '#8A6800' : '#555'
                              }}>
                              {existingRating ? `⭐ Rated ${existingRating.rating}/5 — Edit` : '⭐ Rate this order'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {ratingModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Rate your order</h3>
            <p className="text-sm text-gray-400 mb-5">{ratingModal.orderNumber}</p>
            <div className="flex justify-center gap-3 mb-5">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onMouseEnter={() => setStarHover(s)} onMouseLeave={() => setStarHover(0)} onClick={() => setStarSelected(s)}>
                  <Star size={36} fill={(starHover || starSelected) >= s ? '#F5C800' : 'none'}
                    stroke={(starHover || starSelected) >= s ? '#F5C800' : '#ddd'} />
                </button>
              ))}
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)}
              placeholder="Leave a comment (optional)..." rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none mb-4"
              style={{ border: '1px solid #e5e5e5', color: '#1a1a1a' }} />
            <div className="flex gap-3">
              <button onClick={() => setRatingModal(null)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ border: '1px solid #e5e5e5', color: '#555' }}>Cancel</button>
              <button onClick={submitRating} disabled={!starSelected || submitting}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ background: starSelected ? '#F5C800' : '#f5f5f5', color: starSelected ? '#1a1a1a' : '#aaa' }}>
                {submitting ? 'Saving...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
