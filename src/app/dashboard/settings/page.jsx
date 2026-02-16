"use client";

import { useState } from "react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    company: "SeaNeB Real Estate",
    bio: "Professional real estate agent",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    weeklyDigest: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const tabs = [
    { id: "profile", label: "Profile Settings", icon: "👤" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "billing", label: "Billing & Payments", icon: "💳" },
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
                <div className="bg-amber-600 rounded-lg shadow-md p-6 sm:p-8 text-white">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">Settings</h1>
                  <p className="text-amber-100 text-lg">
                    Manage your account preferences and configurations
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-8 overflow-hidden">
                <div className="border-b border-gray-200 flex flex-wrap md:flex-nowrap">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-4 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab.id
                          ? "border-b-2 border-blue-600 text-blue-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span className="hidden md:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6 md:p-8">
                  {/* Profile Settings Tab */}
                  {activeTab === "profile" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                            </label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter full name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter email"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter phone number"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company
                          </label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter company name"
                          />
                        </div>
                      </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows="4"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Tell us about yourself"
                        />
                      </div>

                      <div className="flex gap-4">
                        <button className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg">
                          Save Changes
                        </button>
                        <button className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === "notifications" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h3>
                      </div>

                      {[
                        {
                          key: "emailNotifications",
                          label: "Email Notifications",
                          description: "Receive notifications via email",
                        },
                        {
                          key: "smsNotifications",
                          label: "SMS Notifications",
                          description: "Receive notifications via SMS",
                        },
                        {
                          key: "marketingEmails",
                          label: "Marketing Emails",
                          description: "Receive promotional emails",
                        },
                        {
                          key: "weeklyDigest",
                          label: "Weekly Digest",
                          description: "Get a summary of your activity",
                        },
                      ].map((notif) => (
                        <div
                          key={notif.key}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {notif.label}
                            </p>
                            <p className="text-sm text-gray-600">
                              {notif.description}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications[notif.key]}
                            onChange={() => handleNotificationChange(notif.key)}
                            className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                          />
                        </div>
                      ))}

                      <button className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg">
                          Save Preferences
                        </button>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === "security" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h3>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Password
                        </h4>
                        <p className="text-gray-600 text-sm mb-4">
                          You last changed your password 45 days ago.
                        </p>
                        <button className="px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                          Change Password
                        </button>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Two-Factor Authentication
                        </h4>
                        <p className="text-gray-600 text-sm mb-4">
                          Enhance your account security with 2FA.
                        </p>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                          Enable 2FA
                        </button>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Active Sessions
                        </h4>
                        <p className="text-gray-600 text-sm mb-4">
                          You have 2 active sessions.
                        </p>
                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                          Sign Out All Sessions
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Billing Tab */}
                  {activeTab === "billing" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Billing & Payments</h3>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Current Plan
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Plan:</span>
                            <span className="font-medium text-gray-900">
                              Premium
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-medium text-gray-900">
                              $99/month
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Renewal Date:</span>
                            <span className="font-medium text-gray-900">
                              March 12, 2026
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Payment Method
                        </h4>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">💳</span>
                            <div>
                              <p className="font-medium text-gray-900">
                                Visa Card
                              </p>
                              <p className="text-sm text-gray-600">
                                **** **** **** 4242
                              </p>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 font-medium">
                            Update
                          </button>
                        </div>
                      </div>

                      <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                        View Invoices
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

