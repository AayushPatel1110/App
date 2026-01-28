"use client"

export default function AuthHeader({ language, setLanguage }) {
  return (
    <div className="auth-header">
      <div className="brand">
        <div className="brand-dot" />
        SeaNeB
      </div>

      <select
        value={language}
        onChange={e => setLanguage(e.target.value)}
        className="lang-select"
      >
        <option value="eng">ENG</option>
        <option value="guj">GUJ</option>
        <option value="hindi">HIN</option>
      </select>
    </div>
  )
}
