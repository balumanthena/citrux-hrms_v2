'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Home,
  Users,
  CalendarCheck,
  Clock,
  Banknote,
  FilePlus,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

type Props = {
  role: 'admin' | 'hr' | 'employee'
  children: React.ReactNode
}

const navLinks = {
  admin: [
    { name: 'Dashboard', path: '/admin', icon: <Home size={20} /> },
    { name: 'Employee Directory', path: '/admin/employees', icon: <Users size={20} /> },
    { name: 'Leave Management', path: '/admin/leaves', icon: <CalendarCheck size={20} /> },
    { name: 'Attendance Tracking', path: '/admin/attendance', icon: <Clock size={20} /> },
    { name: 'Payroll View', path: '/admin/payroll', icon: <Banknote size={20} /> },
    { name: 'Onboarding Tracker', path: '/admin/onboarding', icon: <FilePlus size={20} /> },
  ],
  hr: [
    { name: 'Dashboard', path: '/hr', icon: <Home size={20} /> },
    { name: 'Employee Directory', path: '/hr/employees', icon: <Users size={20} /> },
    { name: 'Leave Management', path: '/hr/leaves', icon: <CalendarCheck size={20} /> },
    { name: 'Attendance Tracking', path: '/hr/attendance', icon: <Clock size={20} /> },
    { name: 'Payroll View', path: '/hr/payroll', icon: <Banknote size={20} /> },
  ],
  employee: [
    { name: 'Dashboard', path: '/employee', icon: <Home size={20} /> },
    { name: 'Attendance Tracking', path: '/employee/attendance', icon: <Clock size={20} /> },
    { name: 'Leave Management', path: '/employee/leaves', icon: <CalendarCheck size={20} /> },
    { name: 'Payroll View', path: '/employee/payroll', icon: <Banknote size={20} /> },
    { name: 'Profile', path: '/employee/profile', icon: <User size={20} /> },
  ],
}

export default function DashboardLayout({ role, children }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const [userName, setUserName] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const storedRole = localStorage.getItem('role')
    const name = localStorage.getItem('name') || 'User'
    const avatar = localStorage.getItem('avatar')

    setUserName(name)
    setAvatarUrl(avatar)

    if (storedRole !== role) {
      router.push('/login')
    }
  }, [])

  const Sidebar = (
    <aside className="w-72 bg-white shadow-lg border-r border-gray-200 p-6 flex flex-col justify-between h-full">
      <div>
        {/* Logo / Brand */}
        <div className="mb-8 flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold text-blue-600">Citrux HRMS</h1>
            <p className="text-xs text-gray-500 capitalize">{role} Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navLinks[role].map((link) => {
            const isActive = pathname === link.path
            return (
              <Link key={link.path} href={link.path}>
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    isActive
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-10 border-t pt-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <img
            src={
              avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || '')}&background=0D8ABC&color=fff`
            }
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover border shadow-sm"
          />
          <div>
            <div className="text-sm font-semibold text-gray-800">{userName}</div>
            <div className="text-xs text-gray-500 capitalize">{role} role</div>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.clear()
            router.push('/login')
          }}
          className="w-full flex items-center gap-2 text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-200 relative">
      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          className="text-blue-600 bg-white shadow p-2 rounded-md"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full">{Sidebar}</div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-72 bg-white shadow-xl p-6">{Sidebar}</div>
          <div
            className="flex-1 bg-black bg-opacity-40"
            onClick={() => setSidebarOpen(false)}
          />
          <button
            className="absolute top-4 right-4 text-gray-800 bg-white p-2 rounded"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
        <div className="bg-white shadow-md rounded-xl p-6">{children}</div>
      </main>
    </div>
  )
}
