"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import {
  DASHBOARD_MODE_BUSINESS,
  getDashboardMode,
  isBusinessRegistered,
} from "@/services/dashboardMode.service";

export default function ListingsPage() {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!isBusinessRegistered() || getDashboardMode() !== DASHBOARD_MODE_BUSINESS) {
      router.replace("/dashboard");
    }
  }, [router]);

  const listings = [
    {
      id: 1,
      title: "Modern Apartment Downtown",
      location: "Manhattan, New York",
      price: "$2,500,000",
      type: "Apartment",
      status: "Active",
      beds: 3,
      baths: 2,
    },
    {
      id: 2,
      title: "Luxury Villa with Pool",
      location: "Beverly Hills, California",
      price: "$5,750,000",
      type: "Villa",
      status: "Active",
      beds: 5,
      baths: 4,
    },
    {
      id: 3,
      title: "Cozy Studio Apartment",
      location: "Brooklyn, New York",
      price: "$850,000",
      type: "Studio",
      status: "Pending",
      beds: 1,
      baths: 1,
    },
    {
      id: 4,
      title: "Commercial Office Space",
      location: "Downtown Los Angeles",
      price: "$1,200,000",
      type: "Commercial",
      status: "Sold",
      beds: 0,
      baths: 2,
    },
    {
      id: 5,
      title: "Family House with Garden",
      location: "Suburban Chicago",
      price: "$650,000",
      type: "House",
      status: "Active",
      beds: 4,
      baths: 3,
    },
    {
      id: 6,
      title: "Penthouse with City View",
      location: "San Francisco, California",
      price: "$3,200,000",
      type: "Penthouse",
      status: "Active",
      beds: 3,
      baths: 3,
    },
  ];

  const filteredListings = listings.filter(
    (listing) => filterStatus === "all" || listing.status === filterStatus
  );

  const statusColors = {
    Active: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Sold: "bg-red-100 text-red-800",
  };

  return (
    <>
      <DashboardHeader />
      <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
        <Sidebar />
        <main className="flex-1 w-full lg:ml-64">
          <div className="p-6 md:p-8 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-10">
                <div className="bg-emerald-600 rounded-lg shadow-md p-6 sm:p-8 text-white">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">Listings</h1>
                  <p className="text-emerald-100 text-lg">
                    Manage your property listings and track their status
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">Filter by Status</h3>
                <div className="flex flex-wrap gap-3">
                  {["all", "Active", "Pending", "Sold"].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        setFilterStatus(status === "all" ? "all" : status)
                      }
                      className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                        filterStatus === (status === "all" ? "all" : status)
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                      }`}
                    >
                      {status === "all" ? "All Listings" : status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Listings Table */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Property
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Location
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Price
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredListings.map((listing) => (
                        <tr key={listing.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {listing.title}
                              </p>
                              <p className="text-sm text-gray-600">
                                {listing.beds > 0 && `${listing.beds} beds`}
                                {listing.beds > 0 && listing.baths > 0 && " • "}
                                {listing.baths > 0 && `${listing.baths} baths`}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{listing.location}</td>
                          <td className="px-6 py-4 text-gray-600">{listing.type}</td>
                          <td className="px-6 py-4 font-semibold text-gray-900">
                            {listing.price}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                statusColors[listing.status]
                              }`}
                            >
                              {listing.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-blue-600 hover:text-blue-800 font-medium">
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredListings.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No listings found for the selected status.
                  </div>
                )}
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-200/50 p-6 hover:shadow-xl transition-shadow card-hover group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Active Listings</p>
                      <div className="text-4xl font-bold text-blue-600">{listings.filter(l => l.status === "Active").length}</div>
                    </div>
                    <div className="text-5xl group-hover:scale-110 transition-transform">📍</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl shadow-lg border border-yellow-200/50 p-6 hover:shadow-xl transition-shadow card-hover group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Pending Listings</p>
                      <div className="text-4xl font-bold text-yellow-600">{listings.filter(l => l.status === "Pending").length}</div>
                    </div>
                    <div className="text-5xl group-hover:scale-110 transition-transform">⏳</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-lg border border-red-200/50 p-6 hover:shadow-xl transition-shadow card-hover group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Sold Listings</p>
                      <div className="text-4xl font-bold text-red-600">{listings.filter(l => l.status === "Sold").length}</div>
                    </div>
                    <div className="text-5xl group-hover:scale-110 transition-transform">✅</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg border border-green-200/50 p-6 hover:shadow-xl transition-shadow card-hover group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Total Listings</p>
                      <div className="text-4xl font-bold text-green-600">{listings.length}</div>
                    </div>
                    <div className="text-5xl group-hover:scale-110 transition-transform">📊</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

