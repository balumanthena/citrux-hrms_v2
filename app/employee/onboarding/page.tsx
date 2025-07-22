'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'

export default function OnboardingStatus() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetch = async () => {
      const email = localStorage.getItem('email')
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('email', email)
        .single()
      if (!error) setData(data)
    }
    fetch()
  }, [])

  return (
    <DashboardLayout role="employee">
      <h1 className="text-2xl font-bold mb-4">My Onboarding Status</h1>

      {data ? (
        <div className="space-y-3 bg-white shadow p-6 rounded">
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Status:</strong> {data.onboarding_status}</p>
          <ul className="mt-4 space-y-2">
            <li>📄 Documents Verified: {data.documents_verified ? '✅' : '❌'}</li>
            <li>🧑‍🏫 Orientation Done: {data.orientation_done ? '✅' : '❌'}</li>
            <li>💻 System Access Given: {data.system_access_given ? '✅' : '❌'}</li>
          </ul>
        </div>
      ) : (
        <p>Loading your onboarding status...</p>
      )}
    </DashboardLayout>
  )
}
