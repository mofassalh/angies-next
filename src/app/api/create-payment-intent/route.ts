import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { RESTAURANT_ID } from '@/lib/restaurant'
import { getStoreStatus } from '@/lib/storeHours'

// Refuse to start a payment when the chosen store is closed, so a customer
// is never charged for an order the shop can't make.
async function closedMessage(locationId?: string, locationName?: string): Promise<string | null> {
  try {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: locs } = await supabase
      .from('locations')
      .select('id, name, is_open, opening_hours')
      .eq('restaurant_id', RESTAURANT_ID)
      .eq('is_active', true)
    if (!locs || locs.length === 0) return null

    const chosen =
      (locationId && locs.find(l => l.id === locationId)) ||
      (locationName && locs.find(l => l.name === locationName)) ||
      null

    if (chosen) {
      const status = getStoreStatus(chosen)
      return status.open ? null : status.message
    }
    // No store sent (e.g. older app version): only block if every store is closed
    const anyOpen = locs.some(l => getStoreStatus(l).open)
    return anyOpen ? null : 'All our stores are closed right now. Please order again when we open.'
  } catch {
    return null // never block payments because of a lookup error
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, currency = 'aud', metadata = {} } = body
    const locationId = body.locationId || metadata.locationId || metadata.location_id
    const locationName = body.locationName || metadata.locationName || metadata.location

    const closed = await closedMessage(locationId, locationName)
    if (closed) {
      return NextResponse.json({ error: closed, storeClosed: true }, { status: 409 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-05-27.dahlia',
    })
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    })
    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
