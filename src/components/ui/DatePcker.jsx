"use client";

export default function DatePicker({ value, onChange, maxToday = true }) {
  const maxDate = maxToday
    ? new Date().toISOString().split("T")[0]
    : undefined;

  return (
    <input
      type="date"
      className="form-input"
      value={value}
      max={maxDate}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
