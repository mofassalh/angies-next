import Link from 'next/link'

export const metadata = {
  title: "Privacy Policy | Angie's Kebabs & Burgers",
  description: "Privacy Policy for Angie's Kebabs & Burgers",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-8 block">← Back to Home</Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: June 2026</p>

        <div className="bg-white rounded-2xl p-8 space-y-6 text-gray-600 text-sm leading-relaxed">
          
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
            <p>We collect information you provide when placing orders, including your name, email address, phone number, and delivery address. We also collect order history and payment information (processed securely via Stripe).</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To process and fulfill your orders</li>
              <li>To send order confirmations and updates</li>
              <li>To manage your loyalty points and rewards</li>
              <li>To improve our services and customer experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Payment Security</h2>
            <p>All payments are processed by Stripe, a PCI-DSS compliant payment processor. We do not store your credit card details on our servers.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Data Sharing</h2>
            <p>We do not sell your personal information to third parties. We may share data with delivery partners (Uber Direct) solely for the purpose of fulfilling your delivery orders.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Data Retention</h2>
            <p>We retain your personal data for as long as necessary to provide our services and comply with legal requirements. You may request deletion of your account at any time.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Your Rights</h2>
            <p>Under the Australian Privacy Act 1988, you have the right to access, correct, or delete your personal information. Contact us at <a href="mailto:hello@angiesknb.com" className="text-yellow-600 hover:underline">hello@angiesknb.com</a> to exercise these rights.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Cookies</h2>
            <p>We use cookies to maintain your session, remember your preferences, and improve site performance. See our <Link href="/cookies" className="text-yellow-600 hover:underline">Cookie Policy</Link> for details.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Contact Us</h2>
            <p>For privacy inquiries, contact us at <a href="mailto:hello@angiesknb.com" className="text-yellow-600 hover:underline">hello@angiesknb.com</a></p>
          </section>

        </div>
      </div>
    </main>
  )
}
