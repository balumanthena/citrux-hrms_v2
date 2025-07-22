'use client'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'

type Request = {
  id: string
  date: string
  requested_status: string
  reason: string
  status: string
  reviewed_by: string | null
  reviewed_at: string | null
}

export default function AttendanceRequestPage() {
  const [requests, setRequests] = useState<Request[]>([])

  useEffect(() => {
    const fetchRequests = async () => {
      const email = localStorage.getItem('email')
      const { data } = await supabase
        .from('attendance_requests')
        .select('*')
        .eq('employee_email', email)
        .order('created_at', { ascending: false })
      if (data) setRequests(data)
    }

    fetchRequests()
  }, [])

  const submitRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = localStorage.getItem('email')
    const date = form.date.value
    const status = form.status.value
    const reason = form.reason.value

    const { error } = await supabase.from('attendance_requests').insert({
      employee_email: email,
      date,
      requested_status: status,
      reason,
    })

    if (!error) {
      alert('Request submitted!')
      form.reset()
    }
  }

  return (
    <DashboardLayout role="employee">
      <h1 className="text-2xl font-bold mb-6">Attendance Regularization</h1>

      {/* Request Form */}
      <form onSubmit={submitRequest} className="bg-white p-4 rounded shadow space-y-4 mb-6">
        <h2 className="text-lg font-semibold">New Request</h2>
        <input type="date" name="date" required className="input" />
        <select name="status" required className="input">
          <option value="">Select Status</option>
          <option value="Present">Present</option>
          <option value="Remote">Remote</option>
          <option value="Absent">Absent</option>
        </select>
        <textarea name="reason" required placeholder="Reason for correction" className="input" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit Request</button>
      </form>

      {/* Previous Requests */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">My Requests</h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Requested</th>
              <th className="p-2">Reason</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.date}</td>
                <td className="p-2">{r.requested_status}</td>
                <td className="p-2">{r.reason}</td>
                <td className={`p-2 font-medium ${
                  r.status === 'Approved' ? 'text-green-600' : r.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'
                }`}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
