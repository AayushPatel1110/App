export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8 bg-[#f8f9fb]">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border p-5">
          <p className="text-sm text-gray-500 mb-1">Total Properties</p>
          <h2 className="text-2xl font-semibold">24</h2>
        </div>

        <div className="bg-white rounded-lg border p-5">
          <p className="text-sm text-gray-500 mb-1">Active Listings</p>
          <h2 className="text-2xl font-semibold">18</h2>
        </div>

        <div className="bg-white rounded-lg border p-5">
          <p className="text-sm text-gray-500 mb-1">Total Users</p>
          <h2 className="text-2xl font-semibold">142</h2>
        </div>
      </div>
    </div>
  )
}
