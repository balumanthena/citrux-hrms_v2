'use client'
import DashboardLayout from '@/components/DashboardLayout'

export default function EmployeeProfile() {
  return (
    <DashboardLayout role="employee">
      <h1 className="text-xl font-semibold mb-2">Your Profile</h1>
      <p>View and update your personal details here.</p>
    </DashboardLayout>
  )
}
