'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase'
import { RESTAURANT_ID } from '@/lib/restaurant'

interface FAQ {
  id: string
  question: string
  answer: string
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('faqs').select('*').eq('restaurant_id', RESTAURANT_ID).eq('is_active', true).order('display_order').then(({ data }) => {
      setFaqs(data || [])
      setLoading(false)
    })
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar selectedLocation={null} onLocationClick={() => {}} />
      <div className="pt-24 pb-16 max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8" style={{fontFamily: 'var(--font-display)'}}>
          Frequently Asked Questions
        </h1>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : faqs.length === 0 ? (
          <p className="text-gray-400">No FAQs available yet.</p>
        ) : (
          <div className="space-y-3">
            {faqs.map(faq => (
              <div key={faq.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-3"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <span className={`text-gray-400 transition-transform flex-shrink-0 ${openId === faq.id ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                {openId === faq.id && (
                  <div className="px-5 pb-4 text-gray-600 leading-relaxed">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
