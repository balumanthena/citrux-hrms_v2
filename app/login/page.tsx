'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { users } from '@/lib/auth'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = () => {
    const user = Object.values(users).find(u => u.username === username && u.password === password)
    if (user) {
      localStorage.setItem('role', user.role)
      router.push(`/${user.role}`)
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Login</h1>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="border p-2 w-full mb-2" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 w-full mb-2" />
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2">Login</button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
