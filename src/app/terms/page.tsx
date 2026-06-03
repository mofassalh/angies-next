import Link from 'next/link'

export const metadata = {
  title: "Terms of Service | Angie's Kebabs & Burgers",
  description: "Terms of Service for Angie's Kebabs & Burgers",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-8 block">← Back to Home</Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: June 2026</p>

        <div className="bg-white rounded-2xl p-8 space-y-6 text-gray-600 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
            <p>By using angiesknb.com, you agree to these Terms of Service. If you do not agree, please do not use our website.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Ordering</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Orders are subject to availability</li>
              <li>Prices are in Australian Dollars (AUD) and include GST</li>
              <li>We reserve the right to refuse or cancel orders</li>
              <li>Order confirmation does not guarantee fulfillment in case of unforeseen circumstances</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Payments</h2>
            <p>Payment is required at the time of ordering. We accept major credit and debit cards via Stripe. All transactions are secure and encrypted.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Refunds & Cancellations</h2>
            <p>Once an order is confirmed and preparation has begun, cancellations may not be possible. For issues with your order, please contact us within 24 hours at <a href="mailto:hello@angiesknb.com" className="text-yellow-600 hover:underline">hello@angiesknb.com</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Allergies & Dietary Requirements</h2>
            <p>Please inform us of any allergies or dietary requirements when placing your order. While we take care to avoid cross-contamination, we cannot guarantee allergen-free preparation.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Loyalty Program</h2>
            <p>Loyalty points have no cash value and cannot be transferred. We reserve the right to modify or terminate the loyalty program at any time.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Limitation of Liability</h2>
            <p>To the extent permitted by Australian law, Angie's Kebabs & Burgers is not liable for any indirect, incidental, or consequential damages arising from use of our services.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Governing Law</h2>
            <p>These terms are governed by the laws of Victoria, Australia.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Contact</h2>
            <p>Questions? Contact us at <a href="mailto:hello@angiesknb.com" className="text-yellow-600 hover:underline">hello@angiesknb.com</a></p>
          </section>

        </div>
      </div>
    </main>
  )
}
