// app/admin/onboarding/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'

type Employee = {
  id: string
  name: string
  email: string
  department: string
  designation: string
  onboarding_status: string
  documents_verified: boolean
  orientation_done: boolean
  system_access_given: boolean
}

export default function OnboardingTracker() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .in('onboarding_status', ['Pending', 'In Progress'])

    if (!error && data) {
      setEmployees(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const toggleTask = async (id: string, field: keyof Employee, value: boolean) => {
    const { error } = await supabase
      .from('employees')
      .update({ [field]: value })
      .eq('id', id)

    if (!error) fetchEmployees()
    else alert('Error updating task: ' + error.message)
  }

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('employees')
      .update({ onboarding_status: status })
      .eq('id', id)

    if (!error) fetchEmployees()
    else alert('Error updating status: ' + error.message)
  }

  return (
    <DashboardLayout role="admin">
      <h1 className="text-2xl font-bold mb-4">Onboarding Tracker</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded text-sm">
          <thead className="bg-gray-200 font-semibold">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Designation</th>
              <th className="p-2 border">Documents</th>
              <th className="p-2 border">Orientation</th>
              <th className="p-2 border">System Access</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="p-2 border">{emp.name}</td>
                <td className="p-2 border">{emp.email}</td>
                <td className="p-2 border">{emp.department}</td>
                <td className="p-2 border">{emp.designation}</td>
                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={emp.documents_verified}
                    onChange={e =>
                      toggleTask(emp.id, 'documents_verified', e.target.checked)
                    }
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={emp.orientation_done}
                    onChange={e =>
                      toggleTask(emp.id, 'orientation_done', e.target.checked)
                    }
                  />
                </td>
                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={emp.system_access_given}
                    onChange={e =>
                      toggleTask(emp.id, 'system_access_given', e.target.checked)
                    }
                  />
                </td>
                <td className="p-2 border">{emp.onboarding_status}</td>
                <td className="p-2 border space-x-2">
                  {emp.onboarding_status !== 'Completed' ? (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(emp.id, 'In Progress')
                        }
                        className="text-yellow-600 hover:underline"
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() =>
                          updateStatus(emp.id, 'Completed')
                        }
                        className="text-green-600 hover:underline"
                      >
                        Mark Completed
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500 italic">Done</span>
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
