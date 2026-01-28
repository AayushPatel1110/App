"use client"

export default function PhoneInput({
  t,
  mobile,
  setMobile,
  country,
  setCountry,
  phoneCodes,
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filteredCountries = phoneCodes.filter(c =>
    c.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <>
      <label className="text-sm font-medium text-black block mb-2">
        {t.mobileLabel}
      </label>

      <div className="relative mb-6">
        <div className="flex items-center w-full rounded-lg border border-gray-300 bg-white px-3 py-3">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 w-[110px] shrink-0 text-sm text-black"
          >
            <img src={country.flag} alt={country.name} className="w-5 h-4" />
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
            className="flex-1 outline-none text-sm text-black"
          />
        </div>

        {open && (
          <div className="absolute left-0 top-[58px] w-full bg-white border rounded-lg shadow-lg z-50">
            <input
              type="text"
              placeholder="Search country"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-3 border-b text-sm outline-none"
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
                  className="w-full flex justify-between px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  <div className="flex gap-3">
                    <img src={c.flag} alt={c.name} className="w-5 h-4" />
                    {c.name}
                  </div>
                  {c.dialCode}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
