"use client"

import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
      <div className="bg-white border rounded-xl px-10 py-8 text-center w-[420px]">
        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center">
            {/* <div className="w-3 h-3 bg-gray-400 rounded-full" /> */}
          </div>
        </div>

        <h1 className="text-2xl font-semibold mb-2">seaneb</h1>
        <p className="text-sm text-gray-500 mb-8">
        </p>

        <button
          onClick={() => router.push("/auth/login")}
          className="w-full py-3 bg-black text-white rounded-md text-sm font-medium"
        >
          login karo 
        </button>
      </div>
    </div>
  )
}
