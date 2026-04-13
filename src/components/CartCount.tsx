'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cartStore'

export default function CartCount() {
  const [count, setCount] = useState(0)
  const totalItems = useCartStore(state => state.getTotalItems())

  useEffect(() => {
    setCount(totalItems)
  }, [totalItems])

  if (count === 0) return null

  return (
    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center" style={{background: 'var(--color-primary)', color: 'var(--color-primary-text)'}}>
      {count}
    </span>
  )
}
