'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'

export default function EmployeePage() {
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
  })
  const [leaveSummary, setLeaveSummary] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
  })
  const [recentPayroll, setRecentPayroll] = useState<{ id: string; month: string; amount: number }[]>([])
  const [profile, setProfile] = useState<{ name: string; email: string; avatar_url: string | null } | null>(null)

  useEffect(() => {
    async function fetchEmployeeData() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) return

      const userId = session.user.id

      // Attendance summary
      const presentRes = await supabase
        .from('attendance')
        .select('id', { count: 'exact', head: true })
        .eq('employee_id', userId)
        .eq('status', 'Present')

      const absentRes = await supabase
        .from('attendance')
        .select('id', { count: 'exact', head: true })
        .eq('employee_id', userId)
        .eq('status', 'Absent')

      setAttendanceSummary({
        present: presentRes.count || 0,
        absent: absentRes.count || 0,
      })

      // Leave summary (manual grouping)
      const leaveRes = await supabase
        .from('leaves')
        .select('status')
        .eq('employee_id', userId)

      const leaveCounts: Record<'approved' | 'pending' | 'rejected', number> = {
        approved: 0,
        pending: 0,
        rejected: 0,
      }

      leaveRes.data?.forEach((leave) => {
        const rawStatus = leave.status?.toLowerCase()
        if (rawStatus === 'approved' || rawStatus === 'pending' || rawStatus === 'rejected') {
          leaveCounts[rawStatus as 'approved' | 'pending' | 'rejected'] += 1
        }
      })

      setLeaveSummary(leaveCounts)

      // Recent payroll
      const payrollRes = await supabase
        .from('payroll')
        .select('id, month, amount')
        .eq('employee_id', userId)
        .order('month', { ascending: false })
        .limit(5)

      if (payrollRes.data) setRecentPayroll(payrollRes.data)

      // Profile data
      const profileRes = await supabase
        .from('employees')
        .select('name, email, avatar_url')
        .eq('id', userId)
        .single()

      if (profileRes.data) setProfile(profileRes.data)
    }

    fetchEmployeeData()
  }, [])

  return (
    <DashboardLayout role="employee">
      <h1 className="text-2xl font-bold mb-6">Welcome, {profile?.name || 'Employee'}</h1>

      {/* Profile Card */}
      <section className="bg-white rounded-xl shadow-md p-6 mb-6 flex items-center gap-6">
        <img
          src={
            profile?.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || '')}&background=0D8ABC&color=fff`
          }
          alt="Avatar"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <p className="text-lg font-semibold">{profile?.name}</p>
          <p className="text-gray-500">{profile?.email}</p>
        </div>
      </section>

      {/* Attendance Summary */}
      <section className="grid grid-cols-2 gap-6 mb-6">
        <StatCard title="Days Present" value={attendanceSummary.present} color="text-green-600" />
        <StatCard title="Days Absent" value={attendanceSummary.absent} color="text-red-600" />
      </section>

      {/* Leave Summary */}
      <section className="grid grid-cols-3 gap-6 mb-6">
        <StatCard title="Approved Leaves" value={leaveSummary.approved} color="text-green-500" />
        <StatCard title="Pending Leaves" value={leaveSummary.pending} color="text-yellow-500" />
        <StatCard title="Rejected Leaves" value={leaveSummary.rejected} color="text-red-500" />
      </section>

      {/* Recent Payroll */}
      <section className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Payroll</h3>
        {recentPayroll.length === 0 && <p className="text-gray-500">No payroll records found.</p>}
        {recentPayroll.length > 0 && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2 px-4">Month</th>
                <th className="py-2 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentPayroll.map((pay) => (
                <tr key={pay.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2 px-4">{pay.month}</td>
                  <td className="py-2 px-4 font-semibold">₹{pay.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </DashboardLayout>
  )
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <p className="text-gray-500">{title}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}
