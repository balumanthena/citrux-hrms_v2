// app/employee/leaves/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'

type LeaveRequest = {
  id: string
  leave_type: string
  from_date: string
  to_date: string
  reason: string
  status: string
}

export default function EmployeeLeaves() {
  const [form, setForm] = useState({
    leave_type: '',
    from_date: '',
    to_date: '',
    reason: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [email, setEmail] = useState('emp@citrux.in') // you can replace with real auth later

  const fetchLeaves = async () => {
    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('employee_email', email)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setLeaveRequests(data)
    }
  }

  useEffect(() => {
    fetchLeaves()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const { error } = await supabase.from('leave_requests').insert([
      {
        ...form,
        employee_email: email,
      },
    ])

    if (!error) {
      setForm({
        leave_type: '',
        from_date: '',
        to_date: '',
        reason: '',
      })
      fetchLeaves()
    } else {
      alert('Error submitting leave request: ' + error.message)
    }

    setSubmitting(false)
  }

  return (
    <DashboardLayout role="employee">
      <h1 className="text-2xl font-bold mb-4">Leave Requests</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 max-w-2xl">
        <h2 className="text-lg font-semibold mb-2">Submit New Leave Request</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select
            required
            className="border p-2 rounded"
            value={form.leave_type}
            onChange={e => setForm({ ...form, leave_type: e.target.value })}
          >
            <option value="">Select Leave Type</option>
            <option value="Casual">Casual</option>
            <option value="Sick">Sick</option>
            <option value="Paid">Paid</option>
          </select>
          <input
            required
            type="text"
            placeholder="Reason"
            className="border p-2 rounded"
            value={form.reason}
            onChange={e => setForm({ ...form, reason: e.target.value })}
          />
          <input
            required
            type="date"
            className="border p-2 rounded"
            value={form.from_date}
            onChange={e => setForm({ ...form, from_date: e.target.value })}
          />
          <input
            required
            type="date"
            className="border p-2 rounded"
            value={form.to_date}
            onChange={e => setForm({ ...form, to_date: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>

      {/* Submitted Requests */}
      <div className="bg-white p-4 rounded shadow max-w-4xl">
        <h2 className="text-lg font-semibold mb-4">Your Leave History</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200 font-semibold">
            <tr>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">From</th>
              <th className="p-2 border">To</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((lr, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-2 border">{lr.leave_type}</td>
                <td className="p-2 border">{lr.from_date}</td>
                <td className="p-2 border">{lr.to_date}</td>
                <td className="p-2 border">{lr.reason}</td>
                <td className="p-2 border font-medium">{lr.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
