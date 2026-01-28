"use client"

import LanguageDropdown from "./LanguageDropdown"

export default function AuthHeader({ language, setLanguage }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2 text-xl font-semibold text-gray-600">
        <div className="w-6 h-6 rounded-full border-2 border-gray-400" />
        SeaNeB
      </div>

      <LanguageDropdown
        value={language}
        onChange={setLanguage}
      />
    </div>
  )
}
