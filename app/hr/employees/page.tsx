// app/hr/employees/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'

type Employee = {
  id: string
  name: string
  email: string
  designation: string
  department: string
  status: string
}

export default function HREmployees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEmployees = async () => {
    const { data, error } = await supabase.from('employees').select('*')
    if (error) {
      console.error('Error fetching employees:', error)
    } else {
      setEmployees(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  return (
    <DashboardLayout role="hr">
      <h1 className="text-2xl font-bold mb-4">Employee Directory</h1>
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <table className="min-w-full border bg-white shadow rounded text-sm">
          <thead>
            <tr className="bg-gray-200 text-left font-semibold">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Designation</th>
              <th className="p-3 border">Department</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="hover:bg-gray-100">
                <td className="p-3 border">{emp.name}</td>
                <td className="p-3 border">{emp.email}</td>
                <td className="p-3 border">{emp.designation}</td>
                <td className="p-3 border">{emp.department}</td>
                <td className="p-3 border">{emp.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardLayout>
  )
}
