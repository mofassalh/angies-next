'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

function ResetPasswordContent() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [validSession, setValidSession] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setValidSession(true)
    })
  }, [])

  const handleReset = async () => {
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Password updated successfully! Redirecting...')
      setTimeout(() => router.push('/'), 2000)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{background: 'linear-gradient(135deg, #FFFDF0 0%, #FFF9D6 100%)'}}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <Image src="/logo.jpg" alt="Angie's" width={72} height={72} className="rounded-full object-cover shadow-md" />
            <span className="font-bold text-xl" style={{fontFamily: 'var(--font-display)'}}>
              Angie's Kebabs & Burgers
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3" style={{background: '#FFF3B0'}}>
              🔐
            </div>
            <h2 className="text-xl font-bold text-gray-900">Set New Password</h2>
            <p className="text-sm text-gray-500 mt-1">Choose a strong password for your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">
              {success}
            </div>
          )}

          {!validSession ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 mb-4">This reset link is invalid or has expired.</p>
              <Link href="/login" className="font-semibold text-sm hover:underline" style={{color: '#D4A900'}}>
                Request a new reset link
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">New Password *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Confirm Password *</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                onClick={handleReset}
                disabled={loading || !password || !confirm}
                className="w-full py-3 rounded-full font-semibold mt-5 transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{background: 'var(--color-primary)', color: '#1A1A1A'}}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          <Link href="/" className="hover:text-gray-600">← Back to Home</Link>
        </p>
      </div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
