import { createClient } from '@/lib/supabase'

export async function getSettings() {
  const supabase = createClient()
  const { data } = await supabase.from('settings').select('*')
  const map: any = {}
  data?.forEach((row: any) => { map[row.key] = row.value })
  return map
}
