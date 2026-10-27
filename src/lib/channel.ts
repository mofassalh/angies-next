const KEY = 'angies_channel'
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000 // remember for 30 days

function clean(v: string | null): string | null {
  if (!v) return null
  const s = v.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30)
  return s || null
}

// Save ?src= (or utm_source) from the current URL, if present
export function captureChannel() {
  try {
    const p = new URLSearchParams(window.location.search)
    const v = clean(p.get('src') || p.get('utm_source'))
    if (v) localStorage.setItem(KEY, JSON.stringify({ v, t: Date.now() }))
  } catch {}
}

// Read the saved channel (null if none or older than 30 days)
export function getChannel(): string | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const { v, t } = JSON.parse(raw)
    if (!v || Date.now() - t > MAX_AGE_MS) return null
    return clean(v)
  } catch {
    return null
  }
}
