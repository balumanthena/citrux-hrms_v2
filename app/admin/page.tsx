'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'

export default function AdminPage() {
  const [employeeCount, setEmployeeCount] = useState(0)
  const [pendingLeaves, setPendingLeaves] = useState(0)
  const [pendingCorrections, setPendingCorrections] = useState(0)
  const [pendingOnboarding, setPendingOnboarding] = useState(0)
  const [leaveTypes, setLeaveTypes] = useState<{ type: string; count: number }[]>([])
  const [monthlyJoins, setMonthlyJoins] = useState<{ month: string; count: number }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch counts
        const empRes = await supabase.from('employees').select('id', { count: 'exact', head: true })
        const leaveRes = await supabase
          .from('leaves')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'Pending')
        const correctionRes = await supabase
          .from('attendance_requests')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'Pending')
        const onboardingRes = await supabase
          .from('onboarding_tasks')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'Pending')

        // Fetch leave types for manual grouping
        const leaveTypeRes = await supabase.from('leaves').select('type')
        let groupedLeaveTypes: { [key: string]: number } = {}
        if (!leaveTypeRes.error && leaveTypeRes.data) {
          groupedLeaveTypes = leaveTypeRes.data.reduce((acc, leave) => {
            acc[leave.type] = (acc[leave.type] || 0) + 1
            return acc
          }, {} as Record<string, number>)
        }
        const leaveTypesArray = Object.entries(groupedLeaveTypes).map(([type, count]) => ({
          type,
          count,
        }))

        // Fetch employees for monthly join grouping
        const employeesRes = await supabase.from('employees').select('join_date')
        let groupedJoins: { [key: string]: number } = {}
        if (!employeesRes.error && employeesRes.data) {
          groupedJoins = employeesRes.data.reduce((acc, emp) => {
            const month = new Date(emp.join_date).toLocaleString('default', { month: 'short', year: 'numeric' })
            acc[month] = (acc[month] || 0) + 1
            return acc
          }, {} as Record<string, number>)
        }
        const monthlyJoinsArray = Object.entries(groupedJoins).map(([month, count]) => ({
          month,
          count,
        })).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()) // sort by date ascending

        // Set states with counts
        if (empRes.count !== null) setEmployeeCount(empRes.count)
        if (leaveRes.count !== null) setPendingLeaves(leaveRes.count)
        if (correctionRes.count !== null) setPendingCorrections(correctionRes.count)
        if (onboardingRes.count !== null) setPendingOnboarding(onboardingRes.count)
        setLeaveTypes(leaveTypesArray)
        setMonthlyJoins(monthlyJoinsArray)
      } catch (error) {
        console.error('Error fetching admin data:', error)
      }
    }

    fetchData()
  }, [])

  const colors = ['#0ea5e9', '#10b981', '#facc15', '#f97316', '#f43f5e']

  return (
    <DashboardLayout role="admin">
      <h1 className="text-2xl font-bold mb-6">Welcome Admin</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Total Employees" value={employeeCount} color="text-blue-600" />
        <Card title="Pending Leaves" value={pendingLeaves} color="text-yellow-600" />
        <Card title="Attendance Corrections" value={pendingCorrections} color="text-red-600" />
        <Card title="Pending Onboarding" value={pendingOnboarding} color="text-green-600" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Leave Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={leaveTypes}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {leaveTypes.map((_, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Monthly Joins</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyJoins}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  )
}

function Card({
  title,
  value,
  color = 'text-blue-600',
}: {
  title: string
  value: number
  color?: string
}) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h4 className="text-sm font-medium text-gray-500 mb-2">{title}</h4>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}
