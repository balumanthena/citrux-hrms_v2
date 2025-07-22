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

export default function AdminEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Omit<Employee, 'id'>>({
    name: '',
    email: '',
    designation: '',
    department: '',
    status: 'Active',
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    setError(null)

    if (editingId) {
      const { error } = await supabase
        .from('employees')
        .update(form)
        .eq('id', editingId)

      if (error) {
        setError(error.message)
      } else {
        setEditingId(null)
        setForm({ name: '', email: '', designation: '', department: '', status: 'Active' })
        fetchEmployees()
      }
    } else {
      const { error } = await supabase.from('employees').insert([form])
      if (error) {
        setError(error.message)
      } else {
        setForm({ name: '', email: '', designation: '', department: '', status: 'Active' })
        fetchEmployees()
      }
    }

    setAdding(false)
  }

  const handleEdit = (emp: Employee) => {
    setForm({
      name: emp.name,
      email: emp.email,
      designation: emp.designation,
      department: emp.department,
      status: emp.status,
    })
    setEditingId(emp.id)
  }

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this employee?')
    if (!confirmed) return

    const { error } = await supabase.from('employees').delete().eq('id', id)
    if (error) {
      alert('Failed to delete: ' + error.message)
    } else {
      fetchEmployees()
    }
  }

  return (
    <DashboardLayout role="admin">
      <h1 className="text-2xl font-bold mb-4">Employee Directory</h1>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">{editingId ? 'Edit Employee' : 'Add New Employee'}</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            required
            placeholder="Name"
            className="border p-2 rounded"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            required
            placeholder="Designation"
            className="border p-2 rounded"
            value={form.designation}
            onChange={e => setForm({ ...form, designation: e.target.value })}
          />
          <input
            placeholder="Department"
            className="border p-2 rounded"
            value={form.department}
            onChange={e => setForm({ ...form, department: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={adding}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button
            type="button"
            className="ml-4 text-red-500 underline"
            onClick={() => {
              setEditingId(null)
              setForm({ name: '', email: '', designation: '', department: '', status: 'Active' })
            }}
          >
            Cancel Edit
          </button>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      {/* Employee Table */}
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
              <th className="p-3 border">Actions</th>
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
                <td className="p-3 border space-x-2">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardLayout>
  )
}
