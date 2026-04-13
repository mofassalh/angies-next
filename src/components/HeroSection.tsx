'use client'

interface HeroProps {
  onOrderClick: () => void
}

export default function HeroSection({ onOrderClick }: HeroProps) {
  return (
    <section className="pt-16 min-h-screen flex items-center relative overflow-hidden" style={{background: 'linear-gradient(135deg, #FFFDF0 0%, #FFF9D6 50%, #FFFEF5 100%)'}}>

      <div className="absolute top-20 right-0 w-96 h-96 rounded-full opacity-20" style={{background: 'var(--color-primary)', filter: 'blur(80px)'}}></div>
      <div className="absolute bottom-20 left-0 w-64 h-64 rounded-full opacity-10" style={{background: 'var(--color-primary)', filter: 'blur(60px)'}}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{background: '#FFF3B0', color: '#1A1A1A'}}>
              <span className="w-1.5 h-1.5 rounded-full" style={{background: 'var(--color-primary)'}}></span>
              Now open in 3 Melbourne locations
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{fontFamily: 'var(--font-display)'}}>
              Fresh &{' '}
              <span style={{color: '#D4A900'}}>Flavourful</span>
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
                style={{background: 'var(--color-primary)', color: '#1A1A1A'}}
              >
                Order Now
              </button>
              <button
                onClick={onOrderClick}
                className="px-8 py-4 rounded-full font-semibold text-base border-2 transition-all hover:bg-yellow-50"
                style={{borderColor: 'var(--color-primary)', color: '#1A1A1A'}}
              >
                View Menu
              </button>
            </div>

            <div className="flex gap-8 mt-12 pt-8 border-t border-yellow-100">
              <div>
                <div className="text-2xl font-bold" style={{fontFamily: 'var(--font-display)'}}>3</div>
                <div className="text-sm text-gray-500">Locations</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{fontFamily: 'var(--font-display)'}}>50+</div>
                <div className="text-sm text-gray-500">Menu Items</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{fontFamily: 'var(--font-display)'}}>4.8★</div>
                <div className="text-sm text-gray-500">Rating</div>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full flex items-center justify-center relative" style={{background: 'linear-gradient(135deg, #FFF3B0, #FFE566)'}}>
              <div className="text-center">
                <div className="text-8xl mb-4">🌯</div>
                <div className="text-lg font-semibold text-gray-700">Angie's Special</div>
                <div className="text-sm text-gray-500">Kebab & Burger</div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2">
                <span className="text-2xl">🍔</span>
                <div>
                  <div className="text-xs font-bold text-gray-800">Gourmet Burger</div>
                  <div className="text-xs text-gray-400">From $12.90</div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2">
                <span className="text-2xl">🥙</span>
                <div>
                  <div className="text-xs font-bold text-gray-800">Kebab Plate</div>
                  <div className="text-xs text-gray-400">From $14.90</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
