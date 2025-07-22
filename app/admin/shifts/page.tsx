'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'

type Shift = {
  id: string
  employee_email: string
  shift_type: string
  shift_date: string
}

export default function ShiftManagement() {
  const [shifts, setShifts] = useState<Shift[]>([])

  useEffect(() => {
    const fetchShifts = async () => {
      const { data } = await supabase
        .from('shifts')
        .select('*')
        .order('shift_date', { ascending: true })
      if (data) setShifts(data)
    }
    fetchShifts()
  }, [])

  const assignShift = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = form.email.value
    const date = form.date.value
    const type = form.shift_type.value

    const { error } = await supabase.from('shifts').insert({
      employee_email: email,
      shift_date: date,
      shift_type: type,
    })

    if (!error) {
      alert('Shift Assigned!')
      form.reset()
    }
  }

  return (
    <DashboardLayout role="admin">
      <h1 className="text-2xl font-bold mb-6">Shift & Rota Management</h1>

      {/* Form */}
      <form onSubmit={assignShift} className="bg-white shadow p-4 rounded space-y-4 mb-6">
        <h2 className="text-lg font-semibold">Assign Shift</h2>
        <input name="email" type="email" required placeholder="Employee Email" className="input" />
        <input name="date" type="date" required className="input" />
        <select name="shift_type" required className="input">
          <option value="">Select Shift</option>
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
          <option value="Night">Night</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Assign</button>
      </form>

      {/* Upcoming Shifts Table */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-4">Upcoming Shifts</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Employee</th>
              <th className="p-2">Date</th>
              <th className="p-2">Shift</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map(s => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.employee_email}</td>
                <td className="p-2">{s.shift_date}</td>
                <td className="p-2">{s.shift_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
