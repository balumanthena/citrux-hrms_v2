'use client'

import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { useEffect, useState } from 'react'

export default function DateRangeSelector({
  onRangeChange,
}: {
  onRangeChange: (range: { startDate: Date; endDate: Date }) => void
}) {
  const [range, setRange] = useState<any>([
    {
      startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
      endDate: new Date(),
      key: 'selection',
    },
  ])

  useEffect(() => {
    const saved = localStorage.getItem('hrms-date-range')
    if (saved) {
      const parsed = JSON.parse(saved)
      setRange([parsed])
      onRangeChange(parsed)
    } else {
      onRangeChange(range[0])
    }
  }, [])

  const handleChange = (ranges: any) => {
    setRange([ranges.selection])
    localStorage.setItem('hrms-date-range', JSON.stringify(ranges.selection))
    onRangeChange(ranges.selection)
  }

  return (
    <div className="bg-white p-4 rounded shadow w-fit">
      <DateRange
        ranges={range}
        onChange={handleChange}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={1}
        direction="horizontal"
      />
    </div>
  )
}
