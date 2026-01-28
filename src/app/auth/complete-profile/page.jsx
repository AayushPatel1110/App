"use client"

import { useState } from "react"
import eng from "@/constants/i18/eng.json"
import guj from "@/constants/i18/guj.json"
import hindi from "@/constants/i18/hindi.json"

const LANG_MAP = { eng, guj, hindi }

export default function CompleteProfilePage() {
  const [language, setLanguage] = useState("eng")
  const t = LANG_MAP[language]

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

  const isValid =
    form.firstName &&
    form.lastName &&
    form.email &&
    form.gender &&
    form.dob &&
    form.hometown &&
    form.seanebId &&
    form.agree

  return (
    <div className="page-center">
      <div className="auth-card">

        {/* Header */}
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

     
        <div className="auth-title">{t.completeProfileTitle}</div>
        <div className="auth-subtitle">{t.completeProfileSubtitle}</div>

        {/* Form */}
        <div className="form-grid">

          <div className="form-group">
            <label className="form-label">{t.firstName} *</label>
            <input
              className="form-input"
              placeholder="John"
              value={form.firstName}
              onChange={e => setForm({ ...form, firstName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t.lastName} *</label>
            <input
              className="form-input"
              placeholder="Doe"
              value={form.lastName}
              onChange={e => setForm({ ...form, lastName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t.email} *</label>
            <input
              className="form-input"
              placeholder="john@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t.gender} *</label>
            <select
              className="form-select"
              value={form.gender}
              onChange={e => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">{t.selectGender}</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t.dob} *</label>
            <input
              type="date"
              className="form-input"
              value={form.dob}
              onChange={e => setForm({ ...form, dob: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <label className="form-label">{t.hometown} *</label>
            <input
              className="form-input"
              value={form.hometown}
              onChange={e => setForm({ ...form, hometown: e.target.value })}
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

        {/* SeaNeB ID */}
        <div className="form-group" style={{ marginTop: "22px" }}>
          <label className="form-label">{t.seanebId} *</label>
          <input
            className="form-input"
            placeholder={t.seanebId}
            value={form.seanebId}
            onChange={e => setForm({ ...form, seanebId: e.target.value })}
          />
        </div>

        {/* Terms */}
        <div className="checkbox-row">
          <input
            type="checkbox"
            checked={form.agree}
            onChange={e => setForm({ ...form, agree: e.target.checked })}
          />
          <span>{t.agreeText}</span>
        </div>

        {/* Submit */}
        <button
          disabled={!isValid}
          className={`primary-btn ${!isValid ? "disabled-btn" : ""}`}
        >
          {t.submit}
        </button>

      </div>
    </div>
  )
}
