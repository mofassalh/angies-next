import { createClient } from '@/lib/supabase'
import { RESTAURANT_ID } from '@/lib/restaurant'

export async function getSettings() {
  const supabase = createClient()
  const { data } = await supabase.from('settings').select('*').eq('restaurant_id', RESTAURANT_ID)
  const map: any = {}
  data?.forEach((row: any) => { map[row.key] = row.value })
  return map
}
