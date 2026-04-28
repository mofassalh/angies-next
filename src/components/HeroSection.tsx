'use client'

interface HeroProps {
  onOrderClick: () => void
}

const VIDEO_URL = 'https://egyxvzjfqnpcfdnwusxn.supabase.co/storage/v1/object/public/menu-images/hero-video.mp4'

export default function HeroSection({ onOrderClick }: HeroProps) {
  return (
    <section className="pt-16 min-h-screen flex items-center relative overflow-hidden">

      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)', zIndex: 1 }} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative" style={{ zIndex: 2 }}>
        <div className="max-w-2xl">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(245,200,0,0.2)', color: '#F5C800', border: '0.5px solid rgba(245,200,0,0.4)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#F5C800' }}></span>
            100% Halal · 3 Melbourne locations
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Fresh &{' '}
            <span style={{ color: '#F5C800' }}>Flavourful</span>
            <br />
            Every Time
          </h1>

          <p className="text-lg mb-8 leading-relaxed max-w-md" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Handcrafted kebabs and gourmet burgers made with the freshest ingredients. Order online for pickup or delivery across Melbourne.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onOrderClick}
              className="px-8 py-4 rounded-full font-semibold text-base transition-all hover:shadow-lg hover:scale-105 active:scale-95"
              style={{ background: '#F5C800', color: '#1A1A1A' }}
            >
              Order Now
            </button>
            <button
              onClick={onOrderClick}
              className="px-8 py-4 rounded-full font-semibold text-base transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '0.5px solid rgba(255,255,255,0.3)' }}
            >
              View Menu
            </button>
          </div>

          <div className="flex gap-8 mt-12 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            <div>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>3</div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Locations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>50+</div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Menu Items</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>4.8★</div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Rating</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
