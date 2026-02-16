"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCookie } from "@/services/cookie"
import { authStore } from "@/services/store/authStore"
import { bootstrapProductAuth } from "@/services/auth.bootstrap"
import {
  DASHBOARD_MODE_BUSINESS,
  getDashboardMode,
  isBusinessRegistered,
} from "@/services/dashboardMode.service"
import DashboardHeader from "@/components/ui/DashboardHeader"

export default function BrokerDashboardPage() {
  const router = useRouter()
  const [authReady, setAuthReady] = useState(false)
  const [businessData, setBusinessData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        if (!isBusinessRegistered() || getDashboardMode() !== DASHBOARD_MODE_BUSINESS) {
          router.replace("/dashboard")
          return
        }

        // Check authentication
        const existing = authStore.getAccessToken()
        if (!existing) {
          let bootstrapSuccess = false

          for (let attempt = 1; attempt <= 3; attempt++) {
            try {
              await bootstrapProductAuth()
              bootstrapSuccess = true
              break
            } catch (err) {
              if (attempt < 3) {
                const delay = Math.min(attempt * 1000, 5000)
                await new Promise((resolve) => setTimeout(resolve, delay))
              }
            }
          }

          if (!bootstrapSuccess) {
            throw new Error("Bootstrap failed after 3 attempts")
          }
        }

        const token = authStore.getAccessToken()
        if (!token) {
          throw new Error("No access token available")
        }

        // Get business data from cookies
        const businessName = getCookie("business_name")
        const businessType = getCookie("business_type")
        const businessLocation = getCookie("business_location")

        setBusinessData({
          name: businessName || "Your Business",
          type: businessType || "Agency",
          location: businessLocation || "Not specified",
        })

        setAuthReady(true)
      } catch (err) {
        console.error("[broker-dashboard] Init error:", err)
        router.replace("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [router])

  if (loading || !authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading broker dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="broker-dashboard-container">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="broker-hero-section">
          <h1 className="broker-hero-title">
            Welcome to Your Broker Dashboard
          </h1>
          <p className="broker-hero-subtitle">Manage your business and properties</p>
        </div>

        {/* Business Info Card */}
        <div className="broker-business-card">
          <h2 className="broker-business-card-title">Your Business</h2>
          <div className="broker-business-info-grid">
            <div className="broker-business-info-item" style={{"--business-color": "var(--brand-blue)"}}>
              <p className="broker-business-info-label">Business Name</p>
              <p className="broker-business-info-value">{businessData?.name}</p>
            </div>
            <div className="broker-business-info-item" style={{"--business-color": "var(--success)"}}>
              <p className="broker-business-info-label">Business Type</p>
              <p className="broker-business-info-value capitalize">{businessData?.type}</p>
            </div>
            <div className="broker-business-info-item" style={{"--business-color": "#9333ea"}}>
              <p className="broker-business-info-label">Location</p>
              <p className="broker-business-info-value">{businessData?.location}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="broker-stats-grid">
          <StatCard
            label="Total Properties"
            value="0"
            icon="🏠"
            colorClass="blue"
          />
          <StatCard
            label="Active Listings"
            value="0"
            icon="📋"
            colorClass="green"
          />
          <StatCard
            label="Total Agents"
            value="0"
            icon="👥"
            colorClass="purple"
          />
          <StatCard
            label="Inquiries"
            value="0"
            icon="💬"
            colorClass="orange"
          />
        </div>

        {/* Main Actions */}
        <div className="broker-actions-grid">
          {/* Add Property */}
          <ActionCard
            title="Add Property"
            description="List a new property for sale or rent"
            icon=""
            onClick={() => {
              console.log("Add property clicked")
            }}
            buttonLabel="Add Property"
          />

          {/* Manage Agents */}
          <ActionCard
            title="Manage Agents"
            description="Add and manage your team members"
            icon="👥"
            onClick={() => {
              console.log("Manage agents clicked")
            }}
            buttonLabel="Manage Agents"
          />

          {/* View Inquiries */}
          <ActionCard
            title="View Inquiries"
            description="Check and respond to property inquiries"
            icon="💬"
            onClick={() => {
              console.log("View inquiries clicked")
            }}
            buttonLabel="View Inquiries"
          />

          {/* Business Settings */}
          <ActionCard
            title="Business Settings"
            description="Update your business information"
            icon="⚙️"
            onClick={() => {
              console.log("Settings clicked")
            }}
            buttonLabel="Go to Settings"
          />
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value, icon, colorClass }) {
  return (
    <div className={`broker-stat-card ${colorClass}`}>
      <div className="broker-stat-icon">{icon}</div>
      <p className="broker-stat-label">{label}</p>
      <p className="broker-stat-value">{value}</p>
    </div>
  )
}

function ActionCard({ title, description, icon, onClick, buttonLabel }) {
  return (
    <div className="broker-action-card">
      <div className="broker-action-icon">{icon}</div>
      <h3 className="broker-action-title">{title}</h3>
      <p className="broker-action-desc">{description}</p>
      <button
        onClick={onClick}
        className="broker-action-button"
      >
        {buttonLabel}
      </button>
    </div>
  )
}

