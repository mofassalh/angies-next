'use client'

import { useEffect } from 'react'
import { captureChannel } from '@/lib/channel'

export default function ChannelTracker() {
  useEffect(() => { captureChannel() }, [])
  return null
}
