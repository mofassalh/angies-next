'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background: 'var(--color-primary)'}}>
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-lg" style={{fontFamily: 'var(--font-display)'}}>Angie's</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Fresh kebabs and gourmet burgers across Melbourne. Made with love, served with pride.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
                <span className="text-sm">f</span>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
                <span className="text-sm">ig</span>
              </a>
            </div>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Our Locations</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <div className="font-medium text-gray-300">St Albans</div>
                <div>123 Main St, VIC 3021</div>
                <div>03 9000 0001</div>
              </li>
              <li>
                <div className="font-medium text-gray-300">Fitzroy North</div>
                <div>456 Brunswick St, VIC 3068</div>
                <div>03 9000 0002</div>
              </li>
              <li>
                <div className="font-medium text-gray-300">Ascot Vale</div>
                <div>789 Moonee St, VIC 3032</div>
                <div>03 9000 0003</div>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/menu" className="hover:text-orange-400 transition-colors">Menu</Link></li>
              <li><Link href="/about" className="hover:text-orange-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-orange-400 transition-colors">Contact</Link></li>
              <li><Link href="/login" className="hover:text-orange-400 transition-colors">Sign In</Link></li>
              <li><Link href="/orders" className="hover:text-orange-400 transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Opening Hours</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex justify-between"><span>Mon – Thu</span><span>11am – 10pm</span></li>
              <li className="flex justify-between"><span>Fri – Sat</span><span>11am – 11pm</span></li>
              <li className="flex justify-between"><span>Sunday</span><span>12pm – 10pm</span></li>
            </ul>
            <div className="mt-6 p-3 rounded-xl text-xs" style={{background: 'rgba(232,83,29,0.15)', color: '#FCA97A'}}>
              📱 Download our app for exclusive deals
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>© 2026 Angie's Kebabs & Burgers. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
