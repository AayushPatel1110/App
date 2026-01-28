"use client"

import { useState } from "react"

export default function CompleteProfileForm({ t }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    dob: "",
    hometown: "",
    seanebId: "",
    agree: false
  })

  const hometowns = [
    "Rameswaram, Tamil Nadu",
    "Rampur, Uttar Pradesh",
    "Ramdevra, Rajasthan",
    "Ramnagar, Uttarakhand",
    "Ramanagara, Karnataka"
  ]

  const filteredHometowns = hometowns.filter(h =>
    h.toLowerCase().includes(form.hometown.toLowerCase())
  )

  const isValid = Boolean(
    form.firstName &&
    form.lastName &&
    form.email &&
    form.gender &&
    form.dob &&
    form.hometown &&
    form.seanebId &&
    form.agree
  )

  return (
    <>
      <div className="auth-title">{t.completeProfileTitle}</div>
      <div className="auth-subtitle">{t.completeProfileSubtitle}</div>

      <div className="form-grid">
        <Input
          label={t.firstName}
          value={form.firstName}
          onChange={v => setForm({ ...form, firstName: v })}
        />

        <Input
          label={t.lastName}
          value={form.lastName}
          onChange={v => setForm({ ...form, lastName: v })}
        />

        <Input
          label={t.email}
          value={form.email}
          onChange={v => setForm({ ...form, email: v })}
        />

        <Select
          label={t.gender}
          value={form.gender}
          options={[t.selectGender, "Male", "Female", "Other"]}
          onChange={v => setForm({ ...form, gender: v })}
        />

        <Input
          label={t.dob}
          type="date"
          value={form.dob}
          onChange={v => setForm({ ...form, dob: v })}
        />
        <div className="form-group" style={{ position: "relative" }}>
          <label className="form-label">{t.hometown} *</label>
          <input
            className="form-input"
            value={form.hometown}
            onChange={e =>
              setForm({ ...form, hometown: e.target.value })
            }
          />

          {form.hometown && (
            <div className="dropdown-box">
              {filteredHometowns.map(h => (
                <div
                  key={h}
                  className="dropdown-item"
                  onClick={() =>
                    setForm({ ...form, hometown: h })
                  }
                >
                  {h}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Input
        label={t.seanebId}
        value={form.seanebId}
        onChange={v => setForm({ ...form, seanebId: v })}
      />

      <div className="checkbox-row">
        <input
          type="checkbox"
          checked={form.agree}
          onChange={e =>
            setForm({ ...form, agree: e.target.checked })
          }
        />
        <span>{t.agreeText}</span>
      </div>

      <button
        disabled={!isValid}
        className={`primary-btn ${!isValid ? "disabled-btn" : ""}`}
      >
        {t.submit}
      </button>
    </>
  )
}

// this is feilds that can be reusbale 

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div className="form-group">
      <label className="form-label">{label} *</label>
      <input
        type={type}
        className="form-input"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

function Select({ label, value, options, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label">{label} *</label>
      <select
        className="form-select"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(opt => (
          <option key={opt} value={opt === options[0] ? "" : opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}
