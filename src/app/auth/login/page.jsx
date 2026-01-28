"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import phoneCodes from "@/constants/phoneCodes.json"

import eng from "@/constants/i18/eng.json"
import guj from "@/constants/i18/guj.json"
import hindi from "@/constants/i18/hindi.json"

import AuthCard from "@/components/ui/AuthCard"
import AuthHeader from "@/components/ui/AuthHeader"

const LANG_MAP = { eng, guj, hindi }

export default function LoginPage() {
  const router = useRouter()

  const [language, setLanguage] = useState("eng")
  const t = LANG_MAP[language]

  const [mobile, setMobile] = useState("")
  const [loading, setLoading] = useState(false)
  const [country, setCountry] = useState(phoneCodes[0])
  const [method, setMethod] = useState("whatsapp")

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const isValid = mobile.length === 10 && !loading

  const filteredCountries = phoneCodes.filter(c =>
    c.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  const handleContinue = () => {
    if (!isValid) return
    setLoading(true)
    setTimeout(() => router.push("/auth/otp"), 600)
  }

  return (
    <AuthCard
      header={
        <AuthHeader
          language={language}
          setLanguage={setLanguage}
        />
      }
    >
      {/* Title */}
      <h1 className="text-xl font-semibold mb-1 text-black">
        {t.login}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {t.subtitle}
      </p>

      {/* Mobile label */}
      <label className="text-sm font-medium text-black block mb-2">
        {t.mobileLabel}
      </label>

      {/* Phone input */}
      <div className="relative mb-6">
        <div className="flex items-center w-full rounded-lg border border-gray-300 bg-white px-3 py-3">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 w-[110px] shrink-0 text-sm text-black"
          >
            <img
              src={country.flag}
              alt={country.name}
              className="w-5 h-4 rounded-sm object-cover"
            />
            <span>{country.dialCode}</span>
            <span className="ml-auto">▾</span>
          </button>

          <div className="mx-3 h-5 w-px bg-gray-200" />

          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            placeholder={t.placeholder}
            value={mobile}
            onChange={e =>
              setMobile(e.target.value.replace(/\D/g, ""))
            }
            className="flex-1 outline-none text-sm text-black placeholder-gray-400"
          />
        </div>

        {open && (
          <div className="absolute left-0 top-[58px] w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50">
            <input
              type="text"
              placeholder="Search country"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-3 border-b border-gray-200 text-sm text-black placeholder-gray-400 outline-none"
            />

            <div className="max-h-60 overflow-y-auto">
              {filteredCountries.map(c => (
                <button
                  key={`${c.name}-${c.dialCode}`}
                  type="button"
                  onClick={() => {
                    setCountry(c)
                    setOpen(false)
                    setSearch("")
                  }}
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 text-sm text-black"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={c.flag}
                      alt={c.name}
                      className="w-5 h-4 rounded-sm object-cover"
                    />
                    <span>{c.name}</span>
                  </div>
                  <span>{c.dialCode}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Method selector */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-10">
          <label className="flex items-center gap-2 text-sm text-black cursor-pointer">
            <input
              type="radio"
              name="method"
              value="whatsapp"
              checked={method === "whatsapp"}
              onChange={e => setMethod(e.target.value)}
            />
            {t.viaWhatsapp}
          </label>

          <label className="flex items-center gap-2 text-sm text-black cursor-pointer">
            <input
              type="radio"
              name="method"
              value="sms"
              checked={method === "sms"}
              onChange={e => setMethod(e.target.value)}
            />
            {t.viaSms}
          </label>
        </div>
      </div>

      {/* Continue button */}
      <button
        disabled={!isValid}
        onClick={handleContinue}
        className={`w-full py-3 rounded-md text-sm font-medium ${
          isValid
            ? "bg-gray-900 text-white"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? t.loading : t.continue}
      </button>
    </AuthCard>
  )
}
