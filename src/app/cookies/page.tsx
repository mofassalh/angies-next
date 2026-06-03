import Link from 'next/link'

export const metadata = {
  title: "Cookie Policy | Angie's Kebabs & Burgers",
  description: "Cookie Policy for Angie's Kebabs & Burgers",
}

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-8 block">← Back to Home</Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: June 2026</p>

        <div className="bg-white rounded-2xl p-8 space-y-6 text-gray-600 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">What Are Cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit our website. They help us provide a better experience.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Cookies We Use</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl" style={{background:'#f9f9f9'}}>
                <div className="font-semibold text-gray-800 mb-1">Essential Cookies</div>
                <p>Required for the website to function. These include session cookies for login, cart data, and order processing. Cannot be disabled.</p>
              </div>
              <div className="p-4 rounded-xl" style={{background:'#f9f9f9'}}>
                <div className="font-semibold text-gray-800 mb-1">Preference Cookies</div>
                <p>Remember your selected location and order preferences for a faster experience.</p>
              </div>
              <div className="p-4 rounded-xl" style={{background:'#f9f9f9'}}>
                <div className="font-semibold text-gray-800 mb-1">Analytics Cookies</div>
                <p>Help us understand how visitors use our site (via Google Analytics). Data is anonymous and aggregated.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Managing Cookies</h2>
            <p>You can control cookies through your browser settings. Disabling essential cookies may affect site functionality. Most browsers allow you to view, delete, or block cookies.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Third-Party Cookies</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Stripe</strong> — Payment processing security</li>
              <li><strong>Google Analytics</strong> — Anonymous usage statistics</li>
              <li><strong>Supabase</strong> — Authentication session management</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact</h2>
            <p>Questions about our cookie use? Email us at <a href="mailto:hello@angiesknb.com" className="text-yellow-600 hover:underline">hello@angiesknb.com</a></p>
          </section>

        </div>
      </div>
    </main>
  )
}
