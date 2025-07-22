'use client'

import Link from 'next/link'

export default function RecentLeavesTable({ data }: { data: any[] }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Leave Requests</h2>
        <Link
          href="/hr/leaves"
          className="text-sm text-blue-600 hover:underline"
        >
          View All →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2 pr-4">Employee</th>
              <th className="py-2 pr-4">Type</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((leave, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition">
                <td className="py-2 pr-4">{leave.employee_name}</td>
                <td className="py-2 pr-4 capitalize">{leave.type}</td>
                <td className="py-2 pr-4">{leave.date}</td>
                <td className="py-2 pr-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      leave.status === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : leave.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {leave.status}
                  </span>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-gray-400 text-center">
                  No leave requests found for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
