// app/employee/attendance/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import dayjs from 'dayjs'

export default function EmployeeAttendance() {
  const [email, setEmail] = useState('emp@citrux.in') // hardcoded for now
  const [todayLog, setTodayLog] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const today = dayjs().format('YYYY-MM-DD')

  const fetchTodayLog = async () => {
    const { data, error } = await supabase
      .from('attendance_logs')
      .select('*')
      .eq('employee_email', email)
      .eq('date', today)
      .single()

    if (!error) {
      setTodayLog(data)
    } else {
      setTodayLog(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTodayLog()
  }, [])

  const handlePunchIn = async () => {
    setProcessing(true)
    const now = dayjs().format('HH:mm:ss')

    const { error } = await supabase.from('attendance_logs').insert([
      {
        employee_email: email,
        date: today,
        check_in: now,
      },
    ])

    if (!error) fetchTodayLog()
    setProcessing(false)
  }

  const handlePunchOut = async () => {
    setProcessing(true)
    const now = dayjs().format('HH:mm:ss')

    const { error } = await supabase
      .from('attendance_logs')
      .update({ check_out: now })
      .eq('employee_email', email)
      .eq('date', today)

    if (!error) fetchTodayLog()
    setProcessing(false)
  }

  return (
    <DashboardLayout role="employee">
      <h1 className="text-2xl font-bold mb-4">Your Attendance</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white p-4 rounded shadow max-w-xl">
          <p className="mb-2">
            <strong>Date:</strong> {today}
          </p>
          <p className="mb-2">
            <strong>Check-In:</strong>{' '}
            {todayLog?.check_in ? todayLog.check_in : '— Not Punched In —'}
          </p>
          <p className="mb-4">
            <strong>Check-Out:</strong>{' '}
            {todayLog?.check_out ? todayLog.check_out : '— Not Punched Out —'}
          </p>

          <div className="space-x-4">
            {!todayLog?.check_in && (
              <button
                onClick={handlePunchIn}
                disabled={processing}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {processing ? 'Punching In...' : 'Punch In'}
              </button>
            )}

            {todayLog?.check_in && !todayLog?.check_out && (
              <button
                onClick={handlePunchOut}
                disabled={processing}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                {processing ? 'Punching Out...' : 'Punch Out'}
              </button>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
