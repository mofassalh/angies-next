// Helpers for the per-store SEO pages (angiesknb.com/st-albans etc.).
// Everything is derived from the `locations` table — nothing store-specific is hardcoded.

export const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// "Angie's Kebabs & Burgers - St Albans" -> "St Albans"
export function areaName(locationName: string): string {
  const parts = String(locationName || '').split(/\s+-\s+/)
  return (parts.length > 1 ? parts[parts.length - 1] : locationName).trim()
}

// "St Albans" -> "st-albans"
export function storeSlug(locationName: string): string {
  return areaName(locationName)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export type DayHours = { open: string; close: string; closed: boolean }

export function parseHours(raw: any): Record<string, DayHours> | null {
  if (!raw) return null
  try {
    const h = typeof raw === 'string' ? JSON.parse(raw) : raw
    return h && typeof h === 'object' && Object.keys(h).length ? h : null
  } catch {
    return null
  }
}

// "23:30" -> "11:30pm", "00:30" -> "12:30am"
export function prettyTime(t: string): string {
  const [hh, mm] = (t || '0:0').split(':').map(n => parseInt(n, 10) || 0)
  const suffix = hh >= 12 ? 'pm' : 'am'
  const h12 = hh % 12 === 0 ? 12 : hh % 12
  return mm === 0 ? `${h12}${suffix}` : `${h12}:${String(mm).padStart(2, '0')}${suffix}`
}

// Latest closing time in the week, e.g. "4am" — used for "Open late until 4am"
export function latestClose(hours: Record<string, DayHours> | null): string | null {
  if (!hours) return null
  let best: { score: number; t: string } | null = null
  for (const d of DAY_ORDER) {
    const h = hours[d]
    if (!h || h.closed) continue
    const [hh, mm] = h.close.split(':').map(Number)
    const [oh] = h.open.split(':').map(Number)
    // after-midnight closes count as later than evening closes
    const score = (hh < oh ? hh + 24 : hh) * 60 + (mm || 0)
    if (!best || score > best.score) best = { score, t: h.close }
  }
  return best ? prettyTime(best.t) : null
}

// Group days that share the same hours: "Mon–Wed 11am–12:30am"
export function groupedHours(hours: Record<string, DayHours> | null): { days: string; time: string }[] {
  if (!hours) return []
  const short: Record<string, string> = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' }
  const label = (d: string) => {
    const h = hours[d]
    if (!h || h.closed) return 'Closed'
    return `${prettyTime(h.open)} – ${prettyTime(h.close)}`
  }
  const rows: { days: string; time: string }[] = []
  let start = 0
  for (let i = 1; i <= DAY_ORDER.length; i++) {
    if (i === DAY_ORDER.length || label(DAY_ORDER[i]) !== label(DAY_ORDER[start])) {
      const a = short[DAY_ORDER[start]]
      const b = short[DAY_ORDER[i - 1]]
      rows.push({ days: a === b ? a : `${a}–${b}`, time: label(DAY_ORDER[start]) })
      start = i
    }
  }
  return rows
}

// schema.org openingHoursSpecification
export function hoursSchema(hours: Record<string, DayHours> | null) {
  if (!hours) return undefined
  return DAY_ORDER.filter(d => hours[d] && !hours[d].closed).map(d => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: `https://schema.org/${d}`,
    opens: hours[d].open,
    closes: hours[d].close,
  }))
}

// Split "2B/66 Kings Road, St Albans VIC 3021" for schema.org PostalAddress
export function postalAddress(address: string) {
  const comma = address.indexOf(',')
  const street = comma > -1 ? address.slice(0, comma).trim() : address
  const rest = comma > -1 ? address.slice(comma + 1).trim() : ''
  const m = rest.match(/^(.*?)\s+([A-Z]{2,3})\s+(\d{4})$/)
  return {
    '@type': 'PostalAddress',
    streetAddress: street,
    addressLocality: m ? m[1] : rest,
    addressRegion: m ? m[2] : undefined,
    postalCode: m ? m[3] : undefined,
    addressCountry: 'AU',
  }
}

// "0393644228" -> "(03) 9364 4228"; mobiles "0414022908" -> "0414 022 908"
export function prettyPhone(p: string | null | undefined): string {
  const d = String(p || '').replace(/\D/g, '')
  if (d.length === 10 && d.startsWith('04')) return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)} ${d.slice(6)}`
  return p || ''
}

export function intlPhone(p: string | null | undefined): string | undefined {
  const d = String(p || '').replace(/\D/g, '')
  return d.length === 10 && d.startsWith('0') ? `+61${d.slice(1)}` : undefined
}
