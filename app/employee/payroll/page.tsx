'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'

type Payroll = {
  id: string
  month: string
  basic_salary: number
  deductions: number
  net_pay: number
  paid_on: string
}

export default function EmployeePayrollPage() {
  const [records, setRecords] = useState<Payroll[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem('email')
      const { data, error } = await supabase
        .from('payroll')
        .select('*')
        .eq('employee_email', email)

      if (!error && data) setRecords(data)
    }

    fetchData()
  }, [])

  return (
    <DashboardLayout role="employee">
      <h1 className="text-2xl font-bold mb-4">My Payroll</h1>
      <table className="w-full bg-white text-sm shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Month</th>
            <th className="p-2 border">Basic Salary</th>
            <th className="p-2 border">Deductions</th>
            <th className="p-2 border">Net Pay</th>
            <th className="p-2 border">Paid On</th>
          </tr>
        </thead>
        <tbody>
          {records.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="p-2 border">{row.month}</td>
              <td className="p-2 border">₹{row.basic_salary}</td>
              <td className="p-2 border">₹{row.deductions}</td>
              <td className="p-2 border text-green-700 font-semibold">₹{row.net_pay}</td>
              <td className="p-2 border">{row.paid_on}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  )
}
