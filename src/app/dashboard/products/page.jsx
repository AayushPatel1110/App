"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";

export default function ProductsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const products = [
    {
      id: 1,
      name: "Premium Listings",
      description: "Get premium visibility for your properties",
      status: "Active",
      icon: "📌",
    },
    {
      id: 2,
      name: "Virtual Tour",
      description: "360-degree virtual tours for properties",
      status: "Active",
      icon: "🎥",
    },
    {
      id: 3,
      name: "Lead Management",
      description: "Manage and track all buyer inquiries",
      status: "Active",
      icon: "👤",
    },
    {
      id: 4,
      name: "Analytics Dashboard",
      description: "Detailed insights and statistics",
      status: "Active",
      icon: "📊",
    },
    {
      id: 5,
      name: "Marketing Tools",
      description: "Email campaigns and promotional tools",
      status: "Inactive",
      icon: "📧",
    },
    {
      id: 6,
      name: "CRM System",
      description: "Complete customer relationship management",
      status: "Inactive",
      icon: "🔧",
    },
  ];

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
                <div className="bg-indigo-600 rounded-lg shadow-md p-6 sm:p-8 text-white">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">Products</h1>
                  <p className="text-indigo-100 text-lg">
                    Manage and explore all available products and services
                  </p>
                </div>
              </div>

              {/* Product Grid */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="border border-gray-200/60 rounded-2xl p-6 hover:shadow-2xl hover:border-indigo-400 transition-all duration-300 bg-gradient-to-br from-white to-indigo-50/30 group card-hover"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-4xl">{product.icon}</span>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            product.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-6">
                        {product.description}
                      </p>

                      <button
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        {isLoading ? "Loading..." : "View Details"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg border border-green-200/50 p-6 hover:shadow-xl transition-shadow card-hover group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Active Products</p>
                      <div className="text-4xl font-bold text-green-600">4</div>
                    </div>
                    <div className="text-5xl group-hover:scale-110 transition-transform">✓</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-300/50 p-6 hover:shadow-xl transition-shadow card-hover group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Inactive Products</p>
                      <div className="text-4xl font-bold text-gray-600">2</div>
                    </div>
                    <div className="text-5xl group-hover:scale-110 transition-transform">⊘</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-lg border border-indigo-200/50 p-6 hover:shadow-xl transition-shadow card-hover group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Total Products</p>
                      <div className="text-4xl font-bold text-indigo-600">6</div>
                    </div>
                    <div className="text-5xl group-hover:scale-110 transition-transform">📦</div>
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

