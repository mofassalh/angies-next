'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase'
import { Star } from 'lucide-react'

interface OrderItem { name: string; quantity: number; lineTotal: number }
interface Order {
  id: string; order_number: string; order_type: string; location: string
  items: OrderItem[]; total: number; status: string; notes: string; created_at: string
}
interface Rating { order_id: string; rating: number; comment: string }

const statusColor: Record<string, string> = {
  pending:'#F59E0B', confirmed:'#3B82F6', preparing:'#8B5CF6',
  ready:'#10B981', delivered:'#10B981', cancelled:'#EF4444',
}
const statusLabel: Record<string, string> = {
  pending:'Pending', confirmed:'Confirmed', preparing:'Preparing',
  ready:'Ready', delivered:'Delivered', cancelled:'Cancelled',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [ratings, setRatings] = useState<Record<string, Rating>>({})
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [ratingModal, setRatingModal] = useState<{ orderId: string; orderNumber: string } | null>(null)
  const [starHover, setStarHover] = useState(0)
  const [starSelected, setStarSelected] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login?redirect=/orders'); return }
      const [{ data: ordersData }, { data: ratingsData }] = await Promise.all([
        supabase.from('orders').select('*').eq('user_id', data.user.id).order('created_at', { ascending: false }),
        supabase.from('order_ratings').select('*').eq('user_id', data.user.id),
      ])
      if (ordersData) setOrders(ordersData)
      if (ratingsData) {
        const map: Record<string, Rating> = {}
        ratingsData.forEach((r: any) => { map[r.order_id] = r })
        setRatings(map)
      }
      setLoading(false)
    })
  }, [])

  const openRating = (order: Order) => {
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
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('order_ratings').upsert({
      order_id: ratingModal.orderId,
      user_id: user!.id,
      rating: starSelected,
      comment,
    }, { onConflict: 'order_id' })
    setRatings(prev => ({ ...prev, [ratingModal.orderId]: { order_id: ratingModal.orderId, rating: starSelected, comment } }))
    setSubmitting(false)
    setRatingModal(null)
  }

  const formatDate = (str: string) => new Date(str).toLocaleDateString('en-AU', {
    day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'
  })

  // Summary stats
  const totalSpent = orders.reduce((s, o) => s + o.total, 0)
  const delivered = orders.filter(o => o.status === 'delivered')
  const avgRating = delivered.length > 0
    ? (delivered.filter(o => ratings[o.id]).reduce((s, o) => s + (ratings[o.id]?.rating || 0), 0) /
      (delivered.filter(o => ratings[o.id]).length || 1)).toFixed(1)
    : null

  if (loading) return (
    <main className="min-h-screen bg-gray-50">
      <Navbar selectedLocation={null} onLocationClick={() => {}} />
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading orders...</div>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar selectedLocation={null} onLocationClick={() => {}} />
      <div className="pt-16 max-w-2xl mx-auto px-4 py-10">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily:'var(--font-display)'}}>My Orders</h1>
            <p className="text-gray-500 mt-1">Your order history</p>
          </div>
          <Link href="/profile" className="text-sm font-medium px-4 py-2 rounded-full"
            style={{background:'var(--color-primary)', color:'#1a1a1a'}}>
            My Profile
          </Link>
        </div>

        {/* Summary Cards */}
        {orders.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
              <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
              <div className="text-xs text-gray-400 mt-1">Total Orders</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
              <div className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(0)}</div>
              <div className="text-xs text-gray-400 mt-1">Total Spent</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
              <div className="text-2xl font-bold text-gray-900">{avgRating ? `${avgRating}⭐` : '—'}</div>
              <div className="text-xs text-gray-400 mt-1">Avg Rating</div>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🧾</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-400 mb-6">Your order history will appear here</p>
            <Link href="/menu" className="px-8 py-3 rounded-full text-white font-semibold inline-block"
              style={{background:'var(--color-primary)'}}>
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const existingRating = ratings[order.id]
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="p-5 cursor-pointer" onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900">{order.order_number}</span>
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold text-white"
                          style={{background: statusColor[order.status] || '#6B7280'}}>
                          {statusLabel[order.status] || order.status}
                        </span>
                      </div>
                      <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{order.order_type === 'delivery' ? '🛵 Delivery' : '🏃 Pickup'} · {order.location}</span>
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                    {existingRating && (
                      <div className="flex items-center gap-1 mt-2">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={13} fill={s <= existingRating.rating ? '#F5C800' : 'none'}
                            stroke={s <= existingRating.rating ? '#F5C800' : '#ccc'} />
                        ))}
                        {existingRating.comment && (
                          <span className="text-xs text-gray-400 ml-1">"{existingRating.comment}"</span>
                        )}
                      </div>
                    )}
                  </div>

                  {expandedId === order.id && (
                    <div className="border-t border-gray-100 px-5 pb-5 pt-4">
                      <div className="space-y-2 mb-3">
                        {(order.items || []).map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.name} x{item.quantity}</span>
                            <span className="font-medium text-gray-900">${item.lineTotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      {order.notes && <div className="text-xs text-gray-400 mt-2">Note: {order.notes}</div>}
                      {order.status === 'delivered' && (
                        <button onClick={() => openRating(order)}
                          className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold border transition-all"
                          style={{
                            border: `1px solid ${existingRating ? '#F5C800' : '#e5e5e5'}`,
                            background: existingRating ? '#FFFBE6' : 'white',
                            color: existingRating ? '#8A6800' : '#555'
                          }}>
                          {existingRating ? `⭐ You rated ${existingRating.rating}/5 — Edit` : '⭐ Rate this order'}
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

      {/* Rating Modal */}
      {ratingModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{background:'rgba(0,0,0,0.4)'}}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Rate your order</h3>
            <p className="text-sm text-gray-400 mb-5">{ratingModal.orderNumber}</p>
            <div className="flex justify-center gap-3 mb-5">
              {[1,2,3,4,5].map(s => (
                <button key={s}
                  onMouseEnter={() => setStarHover(s)}
                  onMouseLeave={() => setStarHover(0)}
                  onClick={() => setStarSelected(s)}>
                  <Star size={36}
                    fill={(starHover || starSelected) >= s ? '#F5C800' : 'none'}
                    stroke={(starHover || starSelected) >= s ? '#F5C800' : '#ddd'}
                    className="transition-all" />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Leave a comment (optional)..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none mb-4"
              style={{border:'1px solid #e5e5e5', color:'#1a1a1a'}} />
            <div className="flex gap-3">
              <button onClick={() => setRatingModal(null)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{border:'1px solid #e5e5e5', color:'#555'}}>
                Cancel
              </button>
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
