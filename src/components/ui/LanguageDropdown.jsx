"use client";

export default function LanguageDropdown({ language, onChange }) {
  return (
    <select
      value={language}
      onChange={(e) => onChange(e.target.value)}
      className="lang-select"
    >
      <option value="eng">ENG</option>
      <option value="guj">GUJ</option>
      <option value="hindi">HIN</option>
    </select>
  );
}
