import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-semibold mb-2">Page not found</h1>
      <p className="text-sm text-gray-500 mb-6">
        The login page you are looking for does not exist
      </p>
      <Link
        href="/auth/login"
        className="px-5 py-2 bg-black text-white rounded-md text-sm"
      >
        Go to Login
      </Link>
    </div>
  )
}
