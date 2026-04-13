'use client'

const items = [
  {
    id: 1,
    name: 'Classic Shish Kebab',
    description: 'Tender marinated lamb on skewers with fresh salad and garlic sauce',
    price: 16.90,
    emoji: '🥙',
    tag: 'Best Seller',
    tagColor: '#E8531D',
  },
  {
    id: 2,
    name: 'Angus Beef Burger',
    description: 'Double Angus patty, cheddar, caramelised onion, house sauce',
    price: 15.90,
    emoji: '🍔',
    tag: 'Popular',
    tagColor: '#F59E0B',
  },
  {
    id: 3,
    name: 'Doner Kebab Wrap',
    description: 'Slow-cooked doner meat, fresh veggies, chilli and garlic sauce in lavash',
    price: 14.90,
    emoji: '🌯',
    tag: 'Fan Favourite',
    tagColor: '#10B981',
  },
  {
    id: 4,
    name: 'Loaded Cheese Fries',
    description: 'Crispy fries topped with melted cheese, jalapeños and sour cream',
    price: 9.90,
    emoji: '🍟',
    tag: 'New',
    tagColor: '#8B5CF6',
  },
]

export default function FeaturedItems() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4" style={{background: '#FEE2D5', color: 'var(--color-primary)'}}>
            ✨ Featured Items
          </div>
          <h2 className="text-4xl font-bold" style={{fontFamily: 'var(--font-display)'}}>
            Customer Favourites
          </h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            Our most loved dishes, made fresh to order every single time
          </p>
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image area */}
              <div className="h-44 flex items-center justify-center relative" style={{background: 'linear-gradient(135deg, #FFF7F4, #FFF0EA)'}}>
                <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{item.emoji}</span>
                <div
                  className="absolute top-3 left-3 text-white text-xs font-semibold px-2 py-1 rounded-full"
                  style={{background: item.tagColor}}
                >
                  {item.tag}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold" style={{color: 'var(--color-primary)'}}>
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    className="w-8 h-8 rounded-full text-white flex items-center justify-center text-lg font-bold hover:scale-110 transition-transform"
                    style={{background: 'var(--color-primary)'}}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-10">
          <button
            className="px-8 py-3 rounded-full font-semibold border-2 transition-all hover:bg-orange-50"
            style={{borderColor: 'var(--color-primary)', color: 'var(--color-primary)'}}
          >
            View Full Menu →
          </button>
        </div>

      </div>
    </section>
  )
}
