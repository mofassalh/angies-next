'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase'

interface OrderItem {
  name: string
  quantity: number
  lineTotal: number
}

interface Order {
  id: string
  order_number: string
  order_type: string
  location: string
  items: OrderItem[]
  total: number
  status: string
  notes: string
  created_at: string
}

const statusColor: Record<string, string> = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  preparing: '#8B5CF6',
  ready: '#10B981',
  delivered: '#10B981',
  cancelled: '#EF4444',
}

const statusLabel: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/login?redirect=/orders')
        return
      }
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })
      if (ordersData) setOrders(ordersData)
      setLoading(false)
    })
  }, [])

  const formatDate = (str: string) => {
    const d = new Date(str)
    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar selectedLocation={null} onLocationClick={() => {}} />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-gray-400">Loading orders...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar selectedLocation={null} onLocationClick={() => {}} />
      <div className="pt-16 max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{fontFamily: 'var(--font-display)'}}>
          My Orders
        </h1>
        <p className="text-gray-500 mb-8">Your order history</p>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🧾</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-400 mb-6">Your order history will appear here</p>
            <Link href="/menu"
              className="px-8 py-3 rounded-full text-white font-semibold inline-block"
              style={{background: 'var(--color-primary)'}}>
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
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
                    {order.notes && (
                      <div className="text-xs text-gray-400 mt-2">
                        Note: {order.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
