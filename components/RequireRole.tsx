'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RequireRole({ role, children }: { role: string; children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const currentRole = localStorage.getItem('role')
    if (currentRole !== role) {
      router.push('/login')
    }
  }, [])

  return <>{children}</>
}
