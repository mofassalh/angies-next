// Meta Pixel helpers. The pixel only loads after the visitor accepts cookies.
declare global {
  interface Window { fbq?: any; _fbq?: any }
}

let loadedId: string | null = null

export function hasConsent(): boolean {
  try { return localStorage.getItem('cookie_consent') === 'accepted' } catch { return false }
}

export function loadPixel(pixelId: string) {
  if (typeof window === 'undefined' || !pixelId || loadedId === pixelId) return
  if (!/^\d{5,20}$/.test(pixelId)) return
  /* eslint-disable */
  ;(function (f: any, b: any, e: any, v: any) {
    if (f.fbq) return
    const n: any = (f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) })
    if (!f._fbq) f._fbq = n
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = []
    const t = b.createElement(e); t.async = true; t.src = v
    const s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
  /* eslint-enable */
  window.fbq('init', pixelId)
  loadedId = pixelId
}

export function trackPageView() {
  if (window.fbq && loadedId) window.fbq('track', 'PageView')
}

export function trackPurchase(value: number, orderId?: string) {
  if (window.fbq && loadedId) {
    window.fbq('track', 'Purchase', { value: Number(value) || 0, currency: 'AUD' }, orderId ? { eventID: orderId } : undefined)
  }
}
