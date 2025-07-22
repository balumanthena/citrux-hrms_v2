'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import LeaveChart from '@/components/LeaveChart'
import AttendanceChart from '@/components/AttendanceChart'
import RecentLeavesTable from '@/components/RecentLeavesTable'
import { supabase } from '@/lib/supabase'
import {
  Users,
  CalendarClock,
  Clock,
} from 'lucide-react'

export default function HRPage() {
  const [employeeCount, setEmployeeCount] = useState(0)
  const [pendingLeaves, setPendingLeaves] = useState(0)
  const [pendingCorrections, setPendingCorrections] = useState(0)
  const [leaveStatusData, setLeaveStatusData] = useState<{ status: string; count: number }[]>([])
  const [attendanceTrend, setAttendanceTrend] = useState<{ month: string; present: number }[]>([])
  const [recentLeaves, setRecentLeaves] = useState<any[]>([])

  const [dateFilter, setDateFilter] = useState<'all' | 'month' | '30days'>('month')

  const getDateRange = () => {
    const now = new Date()
    if (dateFilter === '30days') {
      const past = new Date()
      past.setDate(now.getDate() - 30)
      return past.toISOString()
    }
    if (dateFilter === 'month') {
      return new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    }
    return null
  }

  useEffect(() => {
    const fetchStats = async () => {
      const fromDate = getDateRange()

      const empRes = await supabase.from('employees').select('id', { count: 'exact', head: true })

      const leaveRes = await supabase
        .from('leaves')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'Pending')

      const correctionRes = await supabase
        .from('attendance_requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'Pending')

      const leaveBreakdown = await supabase
        .from('leaves')
        .select('status, created_at', { count: 'exact', head: false })

      const filtered = fromDate
        ? leaveBreakdown.data?.filter(d => new Date(d.created_at) >= new Date(fromDate))
        : leaveBreakdown.data

      const grouped = filtered?.reduce((acc: Record<string, number>, cur: { status: string }) => {
        acc[cur.status] = (acc[cur.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const statusData = Object.entries(grouped || {}).map(([status, count]) => ({
        status,
        count: Number(count),
      }))

      const attendanceRes = [
        { month: 'Jan', present: 92 },
        { month: 'Feb', present: 89 },
        { month: 'Mar', present: 95 },
        { month: 'Apr', present: 88 },
        { month: 'May', present: 91 },
        { month: 'Jun', present: 90 },
      ]

      const recentLeaveRes = await supabase
        .from('leaves')
        .select('employee_name, type, date, status, created_at')
        .order('created_at', { ascending: false })

      const filteredLeaves = fromDate
        ? recentLeaveRes.data?.filter(d => new Date(d.created_at) >= new Date(fromDate)).slice(0, 5)
        : recentLeaveRes.data?.slice(0, 5)

      if (empRes.count !== null) setEmployeeCount(empRes.count)
      if (leaveRes.count !== null) setPendingLeaves(leaveRes.count)
      if (correctionRes.count !== null) setPendingCorrections(correctionRes.count)
      setLeaveStatusData(statusData)
      setAttendanceTrend(attendanceRes)
      setRecentLeaves(filteredLeaves || [])
    }

    fetchStats()
  }, [dateFilter])

  return (
    <DashboardLayout role="hr">
      {/* Welcome + Filter */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Welcome back, HR 👋</h1>
          <p className="text-gray-500 mt-1">Here’s what’s happening in your team today.</p>
        </div>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as any)}
          className="text-sm border rounded px-3 py-2 bg-white shadow-sm text-gray-700"
        >
          <option value="month">This Month</option>
          <option value="30days">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Employees"
          value={employeeCount}
          icon={<Users className="text-blue-600" size={28} />}
          color="blue"
        />
        <StatCard
          title="Pending Leaves"
          value={pendingLeaves}
          icon={<CalendarClock className="text-yellow-600" size={28} />}
          color="yellow"
        />
        <StatCard
          title="Attendance Requests"
          value={pendingCorrections}
          icon={<Clock className="text-red-600" size={28} />}
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <LeaveChart data={leaveStatusData} />
        <AttendanceChart data={attendanceTrend} />
      </div>

      {/* Recent Leaves Table */}
      <RecentLeavesTable data={recentLeaves} />
    </DashboardLayout>
  )
}

// Reusable Stat Card
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: number
  icon: React.ReactNode
  color: 'blue' | 'yellow' | 'red'
}) {
  return (
    <div className="bg-white shadow-sm border border-gray-100 p-5 rounded-xl flex items-center gap-4">
      <div className={`p-3 rounded-full bg-${color}-100`}>
        {icon}
      </div>
      <div>
        <h4 className="text-gray-600 text-sm">{title}</h4>
        <p className={`text-${color}-600 text-2xl font-semibold`}>{value}</p>
      </div>
    </div>
  )
}
