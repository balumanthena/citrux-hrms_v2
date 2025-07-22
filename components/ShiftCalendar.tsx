'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import '@fullcalendar/common/main.css'
import '@fullcalendar/daygrid/main.css'


type ShiftEvent = {
  title: string
  date: string
}

export default function ShiftCalendar() {
  const [events, setEvents] = useState<ShiftEvent[]>([])

  useEffect(() => {
    const fetchShifts = async () => {
      const { data } = await supabase.from('shifts').select('*')
      if (data) {
        const mapped = data.map((shift: any) => ({
          title: `${shift.employee_email} - ${shift.shift_type}`,
          date: shift.shift_date,
        }))
        setEvents(mapped)
      }
    }
    fetchShifts()
  }, [])

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Shift Calendar</h2>
      <div className="bg-white p-4 rounded shadow">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
        />
      </div>
    </div>
  )
}
