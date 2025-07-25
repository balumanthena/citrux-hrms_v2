// app/page.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/login') // or '/admin', '/employee', etc.
  }, [router])

  return null
}
