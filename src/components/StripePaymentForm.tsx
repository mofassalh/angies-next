'use client'
import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

interface Props {
  onSuccess: () => void
  loading: boolean
  setLoading: (v: boolean) => void
  finalTotal: number
}

export default function StripePaymentForm({ onSuccess, loading, setLoading, finalTotal }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState('')

  const handlePay = async () => {
    if (!stripe || !elements) return
    setLoading(true)
    setError('')

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message || 'Payment failed')
      setLoading(false)
      return
    }

    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: finalTotal, currency: 'aud' }),
    })
    const { clientSecret, error: apiError } = await res.json()
    if (apiError) {
      setError(apiError)
      setLoading(false)
      return
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      redirect: 'if_required',
    })

    if (confirmError) {
      setError(confirmError.message || 'Payment failed')
      setLoading(false)
      return
    }

    onSuccess()
  }

  return (
    <div>
      <PaymentElement />
      {error && <p className="text-xs mt-2" style={{ color: '#dc2626' }}>{error}</p>}
      <button
        onClick={handlePay}
        disabled={loading || !stripe}
        className="w-full py-4 rounded-full font-semibold mt-5 transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50"
        style={{ background: 'var(--color-primary)', color: '#1A1A1A' }}>
        {loading ? 'Processing...' : `Pay $${finalTotal.toFixed(2)}`}
      </button>
    </div>
  )
}
