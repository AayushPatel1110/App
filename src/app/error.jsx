"use client"

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-semibold mb-2">something went wrong</h1>
      <p className="text-sm text-gray-500 mb-6">
        an unexpected error
      </p>
      <button
        onClick={reset}
        className="px-5 py-2 bg-black text-white rounded-md text-sm"
      >
        please try again
      </button>
    </div>
  )
}
