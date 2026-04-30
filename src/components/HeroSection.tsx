'use client'

interface HeroProps {
  onOrderClick: () => void
}

const FOOD_IMAGES = [
  'https://egyxvzjfqnpcfdnwusxn.supabase.co/storage/v1/object/public/menu-images/612103217_1812208489731214_5047258597166790035_n.jpg',
  'https://egyxvzjfqnpcfdnwusxn.supabase.co/storage/v1/object/public/menu-images/605841416_1805166860435377_6175045538818271257_n.jpg',
  'https://egyxvzjfqnpcfdnwusxn.supabase.co/storage/v1/object/public/menu-images/596798989_1790337771918286_1246755799281594482_n.jpg',
  'https://egyxvzjfqnpcfdnwusxn.supabase.co/storage/v1/object/public/menu-images/587899805_1779383689680361_5420484393104563568_n.jpg',
]

export default function HeroSection({ onOrderClick }: HeroProps) {
  return (
    <section className="pt-16 min-h-screen flex items-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FFFDF0 0%, #FFF9D6 50%, #FFFEF5 100%)' }}>

      {/* Background blobs */}
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full opacity-20"
        style={{ background: '#F5C800', filter: 'blur(80px)' }} />
      <div className="absolute bottom-20 left-0 w-64 h-64 rounded-full opacity-10"
        style={{ background: '#F5C800', filter: 'blur(60px)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ background: '#FFF3B0', color: '#1A1A1A' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#F5C800' }}></span>
              100% Halal · 3 Melbourne locations
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ fontFamily: 'var(--font-display)', color: '#1A1A1A' }}>
              Fresh &{' '}
              <span style={{ color: '#D4A900' }}>Flavourful</span>
              <br />
              Every Time
            </h1>

            <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-md">
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
                className="px-8 py-4 rounded-full font-semibold text-base border-2 transition-all hover:bg-yellow-50"
                style={{ borderColor: '#F5C800', color: '#1A1A1A' }}
              >
                View Menu
              </button>
            </div>

            <div className="flex gap-8 mt-12 pt-8 border-t border-yellow-100">
              <div>
                <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>3</div>
                <div className="text-sm text-gray-500">Locations</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>50+</div>
                <div className="text-sm text-gray-500">Menu Items</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>4.8★</div>
                <div className="text-sm text-gray-500">Rating</div>
              </div>
            </div>
          </div>

          {/* Right — Food Collage */}
          <div className="relative flex justify-center items-center">
            {/* Main big image */}
            <div className="relative w-72 h-72 lg:w-96 lg:h-96">

              {/* Big circle background */}
              <div className="absolute inset-0 rounded-full"
                style={{ background: 'linear-gradient(135deg, #FFF3B0, #FFE566)' }} />

              {/* Center main image */}
              <div className="absolute inset-4 rounded-full overflow-hidden shadow-2xl">
                <img src={FOOD_IMAGES[0]} alt="food" className="w-full h-full object-cover" />
              </div>

              {/* Top right small */}
              <div className="absolute -top-2 -right-2 w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img src={FOOD_IMAGES[1]} alt="food" className="w-full h-full object-cover" />
              </div>

              {/* Bottom left small */}
              <div className="absolute -bottom-2 -left-2 w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img src={FOOD_IMAGES[2]} alt="food" className="w-full h-full object-cover" />
              </div>

              {/* Bottom right small */}
              <div className="absolute -bottom-4 right-8 w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                <img src={FOOD_IMAGES[3]} alt="food" className="w-full h-full object-cover" />
              </div>

              {/* Floating badge top left */}
              <div className="absolute -top-4 left-4 bg-white rounded-2xl shadow-lg px-3 py-2 flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <div>
                  <div className="text-xs font-bold text-gray-800">Most Popular</div>
                  <div className="text-xs text-gray-400">Kebab Plate</div>
                </div>
              </div>

              {/* Floating badge bottom */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg px-3 py-2 flex items-center gap-2 whitespace-nowrap">
                <span className="text-xl">⭐</span>
                <div>
                  <div className="text-xs font-bold text-gray-800">4.8 Rating</div>
                  <div className="text-xs text-gray-400">500+ reviews</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
