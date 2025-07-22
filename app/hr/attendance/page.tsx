// app/hr/attendance/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'

type AttendanceLog = {
  id: string
  employee_email: string
  date: string
  check_in: string
  check_out: string
}

export default function HRAttendance() {
  const [logs, setLogs] = useState<AttendanceLog[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('attendance_logs')
      .select('*')
      .order('date', { ascending: false })

    if (!error && data) {
      setLogs(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  return (
    <DashboardLayout role="hr">
      <h1 className="text-2xl font-bold mb-4">Employee Attendance</h1>

      {loading ? (
        <p>Loading attendance...</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded text-sm">
          <thead className="bg-gray-200 font-semibold">
            <tr>
              <th className="p-2 border">Employee</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Check-In</th>
              <th className="p-2 border">Check-Out</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="p-2 border">{log.employee_email}</td>
                <td className="p-2 border">{log.date}</td>
                <td className="p-2 border">{log.check_in || '-'}</td>
                <td className="p-2 border">{log.check_out || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardLayout>
  )
}
