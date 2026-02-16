import Link from "next/link"
import AppHeader from "@/components/ui/AppHeader"

export default function NotFound() {
  return (
    <>
      <AppHeader showLogout={false} />
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-semibold mb-2">page not found</h1>
      <p className="text-sm text-gray-500 mb-6">
       the login page are you looking for does not exist
      </p>
      <Link
        href="/auth/login"
        className="px-5 py-2 bg-black text-white rounded-md text-sm"
      >
        go to login page
      </Link>
    </div>
    </>
  )
}
