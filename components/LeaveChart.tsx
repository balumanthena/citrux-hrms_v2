'use client'

import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#34d399', '#facc15', '#f87171'] // Approved, Pending, Rejected

export default function LeaveChart({ data }: { data: { status: string; count: number }[] }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h2 className="text-lg font-semibold mb-4">Leave Status Distribution</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={entry.status} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
