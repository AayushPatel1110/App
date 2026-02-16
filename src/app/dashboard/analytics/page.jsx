"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import {
  DASHBOARD_MODE_BUSINESS,
  getDashboardMode,
  isBusinessRegistered,
} from "@/services/dashboardMode.service";

export default function AnalyticsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isBusinessRegistered() || getDashboardMode() !== DASHBOARD_MODE_BUSINESS) {
      router.replace("/dashboard");
    }
  }, [router]);

  const analyticsData = [
    {
      title: "Total Views",
      value: "24,562",
      change: "+12.5%",
      icon: "👁️",
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Total Inquiries",
      value: "1,284",
      change: "+8.2%",
      icon: "📩",
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Conversion Rate",
      value: "5.24%",
      change: "+2.1%",
      icon: "📊",
      color: "bg-purple-100 text-purple-800",
    },
    {
      title: "Active Agents",
      value: "42",
      change: "+3",
      icon: "👥",
      color: "bg-orange-100 text-orange-800",
    },
  ];

  const monthlyData = [
    { month: "Jan", views: 4200, inquiries: 240, conversions: 24 },
    { month: "Feb", views: 3800, inquiries: 221, conversions: 29 },
    { month: "Mar", views: 5200, inquiries: 229, conversions: 32 },
    { month: "Apr", views: 4500, inquiries: 200, conversions: 21 },
    { month: "May", views: 6100, inquiries: 349, conversions: 35 },
    { month: "Jun", views: 7300, inquiries: 420, conversions: 42 },
  ];

  const topProperties = [
    {
      name: "Downtown Luxury Apartment",
      views: 2847,
      inquiries: 184,
      conversion: "6.47%",
    },
    {
      name: "Beachfront Villa",
      views: 2154,
      inquiries: 156,
      conversion: "7.24%",
    },
    {
      name: "Modern Office Space",
      views: 1968,
      inquiries: 128,
      conversion: "6.50%",
    },
    {
      name: "Family House Suburban",
      views: 1756,
      inquiries: 98,
      conversion: "5.58%",
    },
    {
      name: "Studio Downtown",
      views: 1542,
      inquiries: 92,
      conversion: "5.96%",
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
                <div className="bg-purple-600 rounded-lg shadow-md p-6 sm:p-8 text-white">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">Analytics</h1>
                  <p className="text-purple-100 text-lg">
                    Track performance metrics and insights across your listings
                  </p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {analyticsData.map((metric, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl shadow-lg border border-blue-200/50 p-6 hover:shadow-2xl hover:border-purple-300 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-600 text-sm font-medium">
                          {metric.title}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-3">
                          {metric.value}
                        </p>
                        <p className="text-green-600 text-sm mt-3 font-semibold">
                          {metric.change} from last month
                        </p>
                      </div>
                      <span className="text-5xl ml-2">{metric.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* Monthly Trends */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200/50 p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    Monthly Trends
                  </h3>
                  <div className="space-y-4">
                    {monthlyData.map((data, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            {data.month}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {data.views} views
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(data.views / 7300) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conversion Metrics */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200/50 p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    Conversion Overview
                  </h3>
                  <div className="space-y-6">
                    {monthlyData.slice(0, 4).map((data, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            {data.month}
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            {data.conversions} conversions
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-green-600 h-3 rounded-full"
                            style={{
                              width: `${(data.conversions / 42) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Properties */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">
                    Top Performing Properties
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Property Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Views
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Inquiries
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Conversion Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {topProperties.map((property, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">
                              {property.name}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {property.views.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {property.inquiries}
                          </td>
                          <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                              {property.conversion}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

