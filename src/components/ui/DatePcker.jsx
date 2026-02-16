"use client"

export default function DatePicker({ value, onChange, maxToday = true }) {
  const maxDate = maxToday
    ? new Date().toISOString().split("T")[0]
    : undefined

  return (
    <input
      type="date"
      className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      value={value}
      max={maxDate}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
