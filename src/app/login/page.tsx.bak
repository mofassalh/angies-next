'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { RESTAURANT_ID } from '@/lib/restaurant'

function LoginContent() {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [settings, setSettings] = useState<any>({})
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  useEffect(() => {
    const supabase = createClient()
    supabase.from('settings').select('*').eq('restaurant_id', RESTAURANT_ID).then(({ data }) => {
      const map: any = {}
      data?.forEach((r: any) => { map[r.key] = r.value })
      setSettings(map)
    })
  }, [])

  const businessName = settings.business_name || 'Our Restaurant'

  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    setLoading(true)
    const supabase = createClient()

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        router.push(redirect)
      }
    } else if (mode === 'signup') {
      if (!phone) { setError('Phone number is required'); setLoading(false); return }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, phone } }
      })
      if (error) {
        setError(error.message)
      } else {
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: name,
            phone,
            role: 'customer'
          })
        }
        setSuccess('Account created! Please check your email to verify.')
      }
    } else if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Password reset link sent! Please check your email.')
      }
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${redirect}` }
    })
  }

  const switchMode = (newMode: 'login' | 'signup' | 'forgot') => {
    setMode(newMode)
    setError('')
    setSuccess('')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{background: 'linear-gradient(135deg, #FFFDF0 0%, #FFF9D6 100%)'}}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={businessName} className="w-[72px] h-[72px] rounded-full object-cover shadow-md" />
            ) : (
              <Image src="/logo.jpg" alt={businessName} width={72} height={72} className="rounded-full object-cover shadow-md" />
            )}
            <span className="font-bold text-xl" style={{fontFamily: 'var(--font-display)'}}>
              {businessName}
            </span>
          </Link>
          {redirect === '/checkout' && (
            <div className="mt-3 px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700 font-medium">
              🔒 Please sign in to place your order
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {mode !== 'forgot' && (
            <div className="flex rounded-xl p-1 mb-6" style={{background: '#F3F4F6'}}>
              <button onClick={() => switchMode('login')}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={mode === 'login' ? {background: 'var(--color-primary)', color: '#1A1A1A'} : {color: '#6B7280'}}>
                Sign In
              </button>
              <button onClick={() => switchMode('signup')}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={mode === 'signup' ? {background: 'var(--color-primary)', color: '#1A1A1A'} : {color: '#6B7280'}}>
                Create Account
              </button>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3" style={{background: '#FFF3B0'}}>
                🔑
              </div>
              <h2 className="text-xl font-bold text-gray-900">Forgot Password?</h2>
              <p className="text-sm text-gray-500 mt-1">Enter your email and we'll send you a reset link</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">{success}</div>
          )}

          <div className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Full Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="John Smith" />
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Email *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                placeholder="john@example.com" />
            </div>
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Phone *</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="04XX XXX XXX" />
              </div>
            )}
            {mode !== 'forgot' && (
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Password *</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="••••••••" />
              </div>
            )}
          </div>

          {mode === 'login' && (
            <div className="text-right mt-2">
              <button onClick={() => switchMode('forgot')}
                className="text-xs font-medium hover:underline" style={{color: '#D4A900'}}>
                Forgot Password?
              </button>
            </div>
          )}

          <button onClick={handleSubmit}
            disabled={loading || !email || (mode !== 'forgot' && !password)}
            className="w-full py-3 rounded-full font-semibold mt-5 transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{background: 'var(--color-primary)', color: '#1A1A1A'}}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>

          {mode === 'forgot' && (
            <button onClick={() => switchMode('login')}
              className="w-full mt-3 text-sm py-2 text-gray-400 hover:text-gray-600 transition-colors">
              ← Back to Sign In
            </button>
          )}

          {mode !== 'forgot' && (
            <>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <button onClick={handleGoogle}
                className="w-full py-3 rounded-full font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
