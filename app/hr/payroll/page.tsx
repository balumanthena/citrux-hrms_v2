'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'

type Payroll = {
  id: string
  employee_email: string
  month: string
  basic_salary: number
  deductions: number
  net_pay: number
  paid_on: string
}

export default function HRPayroll() {
  const [records, setRecords] = useState<Payroll[]>([])

  useEffect(() => {
    const fetchPayroll = async () => {
      const { data, error } = await supabase.from('payroll').select('*')
      if (!error && data) setRecords(data)
    }
    fetchPayroll()
  }, [])

  return (
    <DashboardLayout role="hr">
      <h1 className="text-xl font-semibold mb-4">Payroll View (HR)</h1>

      <table className="w-full bg-white text-sm shadow rounded mb-10">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Employee</th>
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
              <td className="p-2 border">{row.employee_email}</td>
              <td className="p-2 border">{row.month}</td>
              <td className="p-2 border">₹{row.basic_salary}</td>
              <td className="p-2 border">₹{row.deductions}</td>
              <td className="p-2 border font-semibold text-green-700">₹{row.net_pay}</td>
              <td className="p-2 border">{row.paid_on}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-6 bg-white rounded shadow max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Add Payroll Record</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const form = e.target as HTMLFormElement
            const employee_email = form.email.value
            const month = form.month.value
            const basic_salary = Number(form.salary.value)
            const deductions = Number(form.deductions.value)

            const { error } = await supabase.from('payroll').insert([
              {
                employee_email,
                month,
                basic_salary,
                deductions,
              },
            ])

            if (!error) {
              alert('Payroll record added!')
              form.reset()
              const { data } = await supabase.from('payroll').select('*')
              if (data) setRecords(data)
            } else {
              alert('Error adding payroll')
              console.error(error)
            }
          }}
          className="space-y-4"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Employee Email"
            className="block w-full border rounded p-2 text-sm"
          />
          <input
            type="text"
            name="month"
            required
            placeholder="Month (e.g., July 2025)"
            className="block w-full border rounded p-2 text-sm"
          />
          <input
            type="number"
            name="salary"
            required
            placeholder="Basic Salary"
            className="block w-full border rounded p-2 text-sm"
          />
          <input
            type="number"
            name="deductions"
            placeholder="Deductions"
            className="block w-full border rounded p-2 text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Payroll
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}
