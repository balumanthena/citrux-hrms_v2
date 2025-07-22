'use client'
import DashboardLayout from '@/components/DashboardLayout'

export default function AdminAttendance() {
  return (
    <DashboardLayout role="admin">
      <h1 className="text-xl font-semibold mb-2">Attendance Tracking (Admin)</h1>
      <p>Monitor employee attendance records here.</p>
    </DashboardLayout>
  )
}
