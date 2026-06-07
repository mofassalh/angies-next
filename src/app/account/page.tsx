'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase'
import { RESTAURANT_ID } from '@/lib/restaurant'
import { Save, LogOut, Star, Package, User, ChevronDown, ChevronUp, RefreshCw, Settings, X } from 'lucide-react'

const statusColor: Record<string, string> = {
  pending:'#F59E0B', confirmed:'#3B82F6', preparing:'#8B5CF6',
  ready:'#10B981', delivered:'#10B981', cancelled:'#EF4444',
}
const statusLabel: Record<string, string> = {
  pending:'Pending', confirmed:'Confirmed', preparing:'Preparing',
  ready:'Ready', delivered:'Delivered', cancelled:'Cancelled',
}

function CountUp({ target, duration = 1200 }: { target: number, duration?: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (target === 0) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <>{count}</>
}

export default function AccountPage() {
  const [tab, setTab] = useState<'profile' | 'orders'>('profile')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({ full_name: '', phone: '', address: '' })
  const [editModal, setEditModal] = useState(false)
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
  const [heroImage, setHeroImage] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [hasNightOrder, setHasNightOrder] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const [visible, setVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('tab') === 'orders') setTab('orders')
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login?redirect=/account'); return }
      setUser(data.user)
      const av = data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || ''
      setAvatarUrl(av)
      const [
        { data: profileData },
        { data: ordersData },
        { data: ratingsData },
        { data: lpData },
        { data: lsData },
        { data: heroData },
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', data.user.id).single(),
        supabase.from('orders').select('*').eq('user_id', data.user.id).eq('restaurant_id', RESTAURANT_ID).order('created_at', { ascending: false }),
        supabase.from('order_ratings').select('*').eq('user_id', data.user.id),
        supabase.from('loyalty_points').select('points').eq('customer_id', data.user.id).eq('restaurant_id', RESTAURANT_ID).single(),
        supabase.from('loyalty_settings').select('*').eq('restaurant_id', RESTAURANT_ID).single(),
        supabase.from('settings').select('value').eq('key', 'hero_image1').eq('restaurant_id', RESTAURANT_ID).single(),
      ])
      if (profileData) setProfile({ full_name: profileData.full_name || '', phone: profileData.phone || '', address: profileData.address || '' })
      if (lpData) setLoyaltyPoints(lpData.points || 0)
      if (lsData) setLoyaltySettings(lsData)
      if (heroData?.value) setHeroImage(heroData.value)
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
        const nightOrder = ordersData.some((o: any) => {
          const h = new Date(o.created_at).getHours()
          return h >= 22 || h < 4
        })
        setHasNightOrder(nightOrder)
      }
      if (ratingsData) {
        setHasRated(ratingsData.length > 0)
        const map: Record<string, any> = {}
        ratingsData.forEach((r: any) => { map[r.order_id] = r })
        setRatings(map)
      }
      setLoading(false)
      setTimeout(() => setVisible(true), 100)
    })
  }, [])

  const getLevelInfo = (o: number) => {
    if (o >= 100) return { name: 'Platinum', icon: '💎', next: null, nextAt: 100 }
    if (o >= 50) return { name: 'Gold', icon: '🥇', next: 'Platinum', nextAt: 100 }
    if (o >= 10) return { name: 'Silver', icon: '🥈', next: 'Gold', nextAt: 50 }
    return { name: 'Bronze', icon: '🥉', next: 'Silver', nextAt: 10 }
  }

  const getBadges = () => [
    { icon: '🎉', name: 'First Order', earned: orderStats.total >= 1 },
    { icon: '🔥', name: '10 Orders', earned: orderStats.total >= 10 },
    { icon: '🥙', name: 'Kebab Lover', earned: !!orderStats.favourite },
    { icon: '🦉', name: 'Night Owl', earned: hasNightOrder },
    { icon: '⭐', name: 'Top Rater', earned: hasRated },
    { icon: '💰', name: 'Big Spender', earned: orderStats.spent >= 500 },
  ]

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

  const handleReorder = (order: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('reorder_items', JSON.stringify(order.items))
      router.push('/menu?reorder=1')
    }
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
    day: 'numeric', month: 'short', year: 'numeric'
  })

  const initials = profile.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?'

  const pointsValue = loyaltySettings ? (loyaltyPoints / loyaltySettings.points_per_dollar_value).toFixed(2) : '0.00'
  const level = getLevelInfo(orderStats.total)
  const progressPct = level.next ? Math.min(100, (orderStats.total / level.nextAt) * 100) : 100

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
      <div className="pt-16 max-w-2xl mx-auto px-4 py-6">

        {/* Cover + Profile */}
        <div className="rounded-3xl overflow-hidden mb-4" style={{border:'1px solid #e5e5e5'}}>
          {/* Cover */}
          <div className="relative w-full h-32 overflow-hidden" style={{background:'#1a1a1a'}}>
            {heroImage && <img src={heroImage} alt="cover" className="w-full h-full object-cover" style={{opacity:0.55}} />}
            <div className="absolute inset-0 opacity-15" style={{backgroundImage:'repeating-linear-gradient(45deg,#F5C800 0,#F5C800 1px,transparent 0,transparent 50%)',backgroundSize:'16px 16px'}} />
            <button onClick={handleLogout}
              className="absolute top-3 right-3 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
              style={{background:'rgba(0,0,0,0.5)', color:'white'}}>
              <LogOut size={11} /> Logout
            </button>
          </div>
          {/* White profile section */}
          <div className="bg-white px-5 pb-5">
            <div className="flex items-end justify-between -mt-8 mb-3">
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0" style={{border:'3px solid white'}}>
                {avatarUrl
                  ? <img src={avatarUrl} alt={initials} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-xl font-bold" style={{background:'var(--color-primary)', color:'#1a1a1a'}}>{initials}</div>
                }
              </div>
              <div className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{background:'#FFF3B0', color:'#7A5F00', border:'1px solid #E8C84A'}}>
                {level.icon} {level.name} Member
              </div>
            </div>
            <div className="font-bold text-gray-900 text-lg">{profile.full_name || 'Welcome!'}</div>
            <div className="text-sm text-gray-400">{user?.email}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'orders', value: orderStats.total, bg:'#E6F1FB', border:'#B5D4F4', valColor:'#185FA5', lblColor:'#378ADD' },
            { label: 'spent', value: Math.round(orderStats.spent), prefix:'$', bg:'#EAF3DE', border:'#C0DD97', valColor:'#3B6D11', lblColor:'#639922' },
            { label: 'points', value: loyaltyPoints, bg:'#FAEEDA', border:'#FAC775', valColor:'#854F0B', lblColor:'#BA7517' },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-3 text-center"
              style={{background:s.bg, border:`0.5px solid ${s.border}`, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)', transition:`all 0.4s ease ${0.1+i*0.1}s`}}>
              <div className="text-xl font-black" style={{color:s.valColor}}>{s.prefix || ''}<CountUp target={s.value} /></div>
              <div className="text-xs mt-0.5" style={{color:s.lblColor}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Food Passport */}
        {loyaltySettings?.is_active && (
          <div className="rounded-3xl p-5 mb-4" style={{background:'#FFFDF5', border:'1.5px solid #E8C84A', opacity: visible ? 1 : 0, transition:'all 0.5s ease 0.3s'}}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-xs font-semibold mb-1" style={{color:'#B8960A', letterSpacing:'0.5px'}}>FOOD PASSPORT</div>
                <div className="text-3xl font-black" style={{color:'#D4A900'}}><CountUp target={loyaltyPoints} /> pts</div>
                <div className="text-sm" style={{color:'#B8960A'}}>worth ${pointsValue}</div>
              </div>
              {level.next && (
                <div className="text-right">
                  <div className="text-xs mb-1" style={{color:'#B8960A'}}>next level</div>
                  <div className="text-sm font-bold" style={{color:'#7A5F00'}}>{level.next === 'Silver' ? '🥈' : level.next === 'Gold' ? '🥇' : '💎'} {level.next}</div>
                  <div className="text-xs" style={{color:'#B8960A'}}>{level.nextAt - orderStats.total} orders away</div>
                </div>
              )}
            </div>
            <div className="flex justify-between text-xs mb-1" style={{color:'#B8960A'}}>
              {['🥉 Bronze','🥈 Silver','🥇 Gold','💎 Platinum'].map((l, i) => (
                <span key={i} style={{opacity: i <= ['Bronze','Silver','Gold','Platinum'].indexOf(level.name) ? 1 : 0.35}}>{l}</span>
              ))}
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-3" style={{background:'#F5E080'}}>
              <div className="h-2 rounded-full" style={{background:'#D4A900', width:`${progressPct}%`, transition:'width 1.2s ease'}} />
            </div>
            <div className="text-xs mb-2" style={{color:'#B8960A'}}>
              {loyaltyPoints >= (loyaltySettings?.min_points_redeem || 100) ? '✅ Ready to redeem on next order!' : `${(loyaltySettings?.min_points_redeem || 100) - loyaltyPoints} more points to unlock redemption`}
            </div>
            {orderStats.favourite && (
              <div className="text-xs pt-3" style={{borderTop:'1px solid #E8C84A', color:'#8A6800'}}>
                ❤️ Favourite: <strong>{orderStats.favourite}</strong>
              </div>
            )}
          </div>
        )}

        {/* Badges */}
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-800 mb-3">Achievements</div>
          <div className="grid grid-cols-3 gap-2">
            {getBadges().map((b, i) => (
              <div key={i} className="rounded-2xl p-3 text-center"
                style={{background: b.earned ? '#FFFDF5' : '#f9f9f9', border: b.earned ? '1.5px solid #E8C84A' : '1px solid #f0f0f0', opacity: b.earned ? 1 : 0.45}}>
                <div className="text-2xl mb-1">{b.icon}</div>
                <div className="text-xs font-semibold" style={{color: b.earned ? '#7A5F00' : '#aaa'}}>{b.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'orders', label: `Orders (${orderStats.total})`, icon: Package },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id as any)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all"
              style={{background: tab === id ? '#1a1a1a' : 'white', color: tab === id ? 'white' : '#666', border:'1px solid #e5e5e5'}}>
              <Icon size={14} />{label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'full name', value: profile.full_name },
                { label: 'member since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' }) : '' },
                { label: 'phone', value: profile.phone },
                { label: 'favourite item', value: orderStats.favourite ? `🥙 ${orderStats.favourite}` : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-2xl p-3" style={{border:'1px solid #f0f0f0'}}>
                  <div className="text-xs text-gray-400 mb-1">{label}</div>
                  <div className="text-sm font-semibold text-gray-900">{value || '—'}</div>
                </div>
              ))}
              <div className="bg-white rounded-2xl p-3 col-span-2" style={{border:'1px solid #f0f0f0'}}>
                <div className="text-xs text-gray-400 mb-1">address</div>
                <div className="text-sm font-semibold text-gray-900">{profile.address || '—'}</div>
              </div>
            </div>
            <button onClick={() => setEditModal(true)}
              className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 bg-white"
              style={{border:'1px solid #e5e5e5', color:'#555'}}>
              <Settings size={14} /> Edit Profile
            </button>
            <div className="bg-white rounded-2xl p-4" style={{border:'1px solid #f0f0f0'}}>
              <div className="text-sm font-semibold text-gray-800 mb-2">Quick Links</div>
              {[{ href:'/menu', label:'🍔 Browse Menu' },{ href:'/delivery', label:'🛵 Delivery Options' }].map(({ href, label }) => (
                <Link key={href} href={href} className="flex items-center justify-between py-2.5 px-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <span className="text-sm text-gray-700">{label}</span>
                  <span className="text-gray-300">›</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center" style={{border:'1px solid #f0f0f0'}}>
                <div className="text-5xl mb-4">🧾</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders yet</h3>
                <Link href="/menu" className="px-6 py-2.5 rounded-full text-sm font-semibold inline-block mt-2" style={{background:'var(--color-primary)', color:'#1a1a1a'}}>Browse Menu</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order, idx) => {
                  const existingRating = ratings[order.id]
                  const isExpanded = expandedId === order.id
                  return (
                    <div key={order.id} className="bg-white rounded-3xl overflow-hidden" style={{border:'1px solid #f0f0f0', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)', transition:`all 0.4s ease ${idx*0.05}s`}}>
                      <div className="p-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-sm">{order.order_number}</span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold text-white" style={{background: statusColor[order.status] || '#6B7280'}}>
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
                            {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= existingRating.rating ? '#F5C800' : 'none'} stroke={s <= existingRating.rating ? '#F5C800' : '#ccc'} />)}
                          </div>
                        )}
                      </div>
                      {isExpanded && (
                        <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                          <div className="space-y-1.5 mb-3">
                            {(order.items || []).map((item: any, i: number) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.name} x{item.quantity}</span>
                                <span className="font-medium text-gray-900">${item.lineTotal?.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          {order.notes && <div className="text-xs text-gray-400 mb-3">📝 {order.notes}</div>}
                          <div className="flex gap-2">
                            <button onClick={() => handleReorder(order)}
                              className="flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all hover:scale-105"
                              style={{background:'var(--color-primary)', color:'#1a1a1a'}}>
                              <RefreshCw size={13} /> Reorder
                            </button>
                            {order.status === 'delivered' && (
                              <button onClick={() => openRating(order)}
                                className="flex-1 py-2 rounded-xl text-sm font-semibold"
                                style={{border:`1px solid ${existingRating ? '#F5C800' : '#e5e5e5'}`, background: existingRating ? '#FFFBE6' : 'white', color: existingRating ? '#8A6800' : '#555'}}>
                                {existingRating ? `⭐ ${existingRating.rating}/5` : '⭐ Rate'}
                              </button>
                            )}
                          </div>
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

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{background:'rgba(0,0,0,0.5)'}}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
              <button onClick={() => setEditModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3 mb-5">
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
                    style={{border:'1px solid #e5e5e5', color:'#1a1a1a'}} />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{border:'1px solid #e5e5e5', color:'#555'}}>Cancel</button>
              <button onClick={async () => { await handleSave(); setEditModal(false) }} disabled={saving}
                className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                style={{background:'var(--color-primary)', color:'#1a1a1a'}}>
                <Save size={14} />
                {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{background:'rgba(0,0,0,0.4)'}}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Rate your order</h3>
            <p className="text-sm text-gray-400 mb-5">{ratingModal.orderNumber}</p>
            <div className="flex justify-center gap-3 mb-5">
              {[1,2,3,4,5].map(s => (
                <button key={s} onMouseEnter={() => setStarHover(s)} onMouseLeave={() => setStarHover(0)} onClick={() => setStarSelected(s)}>
                  <Star size={36} fill={(starHover || starSelected) >= s ? '#F5C800' : 'none'} stroke={(starHover || starSelected) >= s ? '#F5C800' : '#ddd'} />
                </button>
              ))}
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)}
              placeholder="Leave a comment (optional)..." rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none mb-4"
              style={{border:'1px solid #e5e5e5', color:'#1a1a1a'}} />
            <div className="flex gap-3">
              <button onClick={() => setRatingModal(null)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{border:'1px solid #e5e5e5', color:'#555'}}>Cancel</button>
              <button onClick={submitRating} disabled={!starSelected || submitting}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{background: starSelected ? '#F5C800' : '#f5f5f5', color: starSelected ? '#1a1a1a' : '#aaa'}}>
                {submitting ? 'Saving...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
