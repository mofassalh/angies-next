'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { Save, Upload } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const fetchSettings = async () => {
    const { data } = await supabase.from('settings').select('*')
    const map: any = {}
    data?.forEach(row => { map[row.key] = row.value })
    setSettings(map)
    setLoading(false)
  }

  useEffect(() => { fetchSettings() }, [])

  const handleSave = async () => {
    setSaving(true)
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from('settings').upsert({ key, value }, { onConflict: 'key' })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `logo.${ext}`
    const { error } = await supabase.storage.from('menu-images').upload(fileName, file, { upsert: true })
    if (!error) {
      const { data: urlData } = supabase.storage.from('menu-images').getPublicUrl(fileName)
      setSettings((s: any) => ({ ...s, logo_url: urlData.publicUrl }))
    }
    setUploading(false)
  }

  if (loading) return <p className="text-sm" style={{ color: '#aaa' }}>Loading...</p>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>Settings</h2>
          <p className="text-sm mt-1" style={{ color: '#888' }}>Manage your business settings</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm"
          style={{ backgroundColor: saved ? '#22c55e' : '#F5C800', color: '#1A1A1A' }}>
          <Save size={16} />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Branding */}
      <div className="rounded-2xl p-6 mb-4" style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5' }}>
        <h3 className="font-semibold mb-4" style={{ color: '#1A1A1A' }}>Branding</h3>

        {/* Logo */}
        <div className="mb-4">
          <label className="text-sm mb-2 block" style={{ color: '#555' }}>Logo</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: '#f5f5f5', border: '1px solid #e5e5e5' }}>
              {settings.logo_url ? (
                <img src={settings.logo_url} alt="logo" className="w-full h-full object-contain" />
              ) : (
                <span className="text-2xl">🍽️</span>
              )}
            </div>
            <button onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
              style={{ border: '1px solid #e5e5e5', color: '#555' }}>
              <Upload size={14} />
              {uploading ? 'Uploading...' : 'Upload Logo'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm mb-1 block" style={{ color: '#555' }}>Business Name</label>
            <input value={settings.business_name || ''}
              onChange={e => setSettings((s: any) => ({ ...s, business_name: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ border: '1px solid #e5e5e5', color: '#1A1A1A' }} />
          </div>
          <div>
            <label className="text-sm mb-1 block" style={{ color: '#555' }}>Tagline</label>
            <input value={settings.tagline || ''}
              onChange={e => setSettings((s: any) => ({ ...s, tagline: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ border: '1px solid #e5e5e5', color: '#1A1A1A' }} />
          </div>
          <div>
            <label className="text-sm mb-1 block" style={{ color: '#555' }}>Primary Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={settings.primary_color || '#F5C800'}
                onChange={e => setSettings((s: any) => ({ ...s, primary_color: e.target.value }))}
                className="w-12 h-10 rounded-lg cursor-pointer border-0 outline-none"
                style={{ border: '1px solid #e5e5e5' }} />
              <input value={settings.primary_color || ''}
                onChange={e => setSettings((s: any) => ({ ...s, primary_color: e.target.value }))}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none font-mono"
                style={{ border: '1px solid #e5e5e5', color: '#1A1A1A' }} />
              <div className="w-10 h-10 rounded-xl"
                style={{ backgroundColor: settings.primary_color || '#F5C800' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-2xl p-6 mb-4" style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5' }}>
        <h3 className="font-semibold mb-4" style={{ color: '#1A1A1A' }}>Contact</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm mb-1 block" style={{ color: '#555' }}>Phone</label>
            <input value={settings.phone || ''}
              onChange={e => setSettings((s: any) => ({ ...s, phone: e.target.value }))}
              placeholder="+61 3 XXXX XXXX"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ border: '1px solid #e5e5e5', color: '#1A1A1A' }} />
          </div>
          <div>
            <label className="text-sm mb-1 block" style={{ color: '#555' }}>Email</label>
            <input value={settings.email || ''}
              onChange={e => setSettings((s: any) => ({ ...s, email: e.target.value }))}
              placeholder="hello@angiesknb.com"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ border: '1px solid #e5e5e5', color: '#1A1A1A' }} />
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5' }}>
        <h3 className="font-semibold mb-4" style={{ color: '#1A1A1A' }}>Social Media</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm mb-1 block" style={{ color: '#555' }}>Facebook URL</label>
            <input value={settings.facebook || ''}
              onChange={e => setSettings((s: any) => ({ ...s, facebook: e.target.value }))}
              placeholder="https://facebook.com/angiesknb"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ border: '1px solid #e5e5e5', color: '#1A1A1A' }} />
          </div>
          <div>
            <label className="text-sm mb-1 block" style={{ color: '#555' }}>Instagram URL</label>
            <input value={settings.instagram || ''}
              onChange={e => setSettings((s: any) => ({ ...s, instagram: e.target.value }))}
              placeholder="https://instagram.com/angiesknb"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ border: '1px solid #e5e5e5', color: '#1A1A1A' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
