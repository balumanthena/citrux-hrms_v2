// app/hr/leaves/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'

type LeaveRequest = {
  id: string
  employee_email: string
  leave_type: string
  from_date: string
  to_date: string
  reason: string
  status: string
}

export default function HRLeaves() {
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setRequests(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const updateStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    const { error } = await supabase
      .from('leave_requests')
      .update({ status })
      .eq('id', id)

    if (!error) {
      fetchRequests()
    } else {
      alert('Error updating status: ' + error.message)
    }
  }

  return (
    <DashboardLayout role="hr">
      <h1 className="text-2xl font-bold mb-4">Leave Approval</h1>

      {loading ? (
        <p>Loading requests...</p>
      ) : (
        <table className="min-w-full text-sm bg-white shadow rounded">
          <thead className="bg-gray-200 font-semibold">
            <tr>
              <th className="p-2 border">Employee</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">From</th>
              <th className="p-2 border">To</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="p-2 border">{req.employee_email}</td>
                <td className="p-2 border">{req.leave_type}</td>
                <td className="p-2 border">{req.from_date}</td>
                <td className="p-2 border">{req.to_date}</td>
                <td className="p-2 border">{req.reason}</td>
                <td className="p-2 border font-medium">{req.status}</td>
                <td className="p-2 border space-x-2">
                  {req.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => updateStatus(req.id, 'Approved')}
                        className="text-green-600 hover:underline"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(req.id, 'Rejected')}
                        className="text-red-600 hover:underline"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500 italic">No action</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardLayout>
  )
}
