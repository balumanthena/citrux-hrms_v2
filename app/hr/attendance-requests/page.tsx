'use client'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'
import dayjs from 'dayjs'

type Request = {
  id: string
  employee_email: string
  date: string
  requested_status: string
  reason: string
  status: string
}

export default function HRApprovalPage() {
  const [requests, setRequests] = useState<Request[]>([])

  const fetchRequests = async () => {
    const { data } = await supabase
      .from('attendance_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .eq('status', 'Pending')
    if (data) setRequests(data)
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleAction = async (id: string, action: 'Approved' | 'Rejected') => {
    const reviewed_by = localStorage.getItem('email') || 'hr@citrux.in'
    const reviewed_at = new Date().toISOString()

    const { error } = await supabase
      .from('attendance_requests')
      .update({ status: action, reviewed_by, reviewed_at })
      .eq('id', id)

    if (!error) {
      alert(`Request ${action.toLowerCase()} successfully`)
      fetchRequests()
    }
  }

  return (
    <DashboardLayout role="hr">
      <h1 className="text-2xl font-bold mb-6">Attendance Correction Requests</h1>

      <div className="bg-white rounded shadow p-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-2">Employee</th>
              <th className="p-2">Date</th>
              <th className="p-2">Requested Status</th>
              <th className="p-2">Reason</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">No pending requests</td>
              </tr>
            ) : (
              requests.map(req => (
                <tr key={req.id} className="border-t">
                  <td className="p-2">{req.employee_email}</td>
                  <td className="p-2">{dayjs(req.date).format('YYYY-MM-DD')}</td>
                  <td className="p-2">{req.requested_status}</td>
                  <td className="p-2">{req.reason}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => handleAction(req.id, 'Approved')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'Rejected')}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
