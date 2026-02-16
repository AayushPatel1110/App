"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authStore } from "@/services/store/authStore";
import { bootstrapProductAuth } from "@/services/auth.bootstrap";
import {
  DASHBOARD_MODE_BUSINESS,
  getDashboardMode,
  isBusinessRegistered,
} from "@/services/dashboardMode.service";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ProductList from "@/components/feature/ProductList";

export default function DashboardPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (isBusinessRegistered() && getDashboardMode() === DASHBOARD_MODE_BUSINESS) {
        router.replace("/dashboard/broker");
        return;
      }

      try {
        // If we already have an access token (set during OTP verify), skip bootstrap
        const existing = authStore.getAccessToken();
        if (!existing) {
          let bootstrapSuccess = false;
          
          // Try bootstrap with multiple retries
          for (let attempt = 1; attempt <= 3; attempt++) {
            try {
              await bootstrapProductAuth();
              bootstrapSuccess = true;
              break;
            } catch (err) {
              if (attempt < 3) {
                const delay = Math.min(attempt * 1000, 5000);
                await new Promise((resolve) => setTimeout(resolve, delay));
              }
            }
          }
          
          if (!bootstrapSuccess) {
            throw new Error("Bootstrap failed after 3 attempts - session may be expired");
          }
        }

        const token = authStore.getAccessToken();
        if (!token) {
          throw new Error("No access token available after auth init");
        }

        // Get session start time from cookies for backup
        let sessionStartTime = authStore.getSessionStartTime();
        
        if (!sessionStartTime) {
          // Session not found (should not happen - should be set during OTP verify)
          console.warn("\n[Dashboard] Session start time missing! Setting now (this should have been set during OTP verify)");
          authStore.setSessionStartTime();
          sessionStartTime = authStore.getSessionStartTime();
        }
        
        const sessionExpiresAt = new Date(sessionStartTime + 6 * 60 * 60 * 1000);
        console.log("\n[Dashboard] Session active");
        console.log(`   Session started: ${new Date(sessionStartTime).toLocaleTimeString()}`);
        console.log(`   Session expires: ${sessionExpiresAt.toLocaleTimeString()}`);
        console.log(`   Timers running in background for auto-refresh and session management`);

        console.log("\n[Dashboard] Authentication ready");
        setAuthReady(true);
      } catch (err) {
        console.error("\n[Dashboard] Authentication init failed:", err.message);
        console.error("   Session may have expired or refresh token is invalid");
        console.error("   Redirecting to login...");
        router.replace("/auth/login");
      }
    };

    init();

    // Listen for session expiry events (6-hour timeout)
    const handleAuthRefreshFailed = (event) => {
      const errorData = event?.detail?.error;
      const isSessionExpired = 
        errorData?.response?.status === 401 ||
        errorData?.response?.data?.reason === "SESSION_EXPIRED" ||
        errorData?.response?.data?.message?.includes("SESSION_EXPIRED");

      if (isSessionExpired) {
        console.error("\n[Dashboard] SESSION EXPIRED - 6 hour session ended");
        console.error("   User must login again");
        
        // Clear tokens (session tracking also cleared by authStore.clearAll)
        authStore.clearAll();
        
        // Redirect to login
        router.replace("/auth/login");
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth:refresh-failed", handleAuthRefreshFailed);
    }

    // Session timer - update every 10 seconds (6-hour session tracking)
    const sessionTimer = setInterval(() => {
      const sessionStartTime = authStore.getSessionStartTime();
      if (sessionStartTime) {
        const sessionElapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        const sessionRemaining = (6 * 60 * 60) - sessionElapsed;
        
        if (sessionRemaining <= 0) {
          console.error("\n[Dashboard] SESSION TIMEOUT - 6 hours has passed");
          authStore.clearAll();
          window.removeEventListener("auth:refresh-failed", handleAuthRefreshFailed);
          clearInterval(sessionTimer);
          clearInterval(tokenRefreshTimer);
          router.replace("/auth/login");
        }
      }
    }, 10000); // Check every 10 seconds

    // Access token refresh timer - refresh proactively every 14 minutes (before 15 min expiry)
    const tokenRefreshTimer = setInterval(async () => {
      // Get token issued time from cookie
      let tokenIssuedTime = null;
      if (typeof window !== "undefined") {
        const pairs = document.cookie.split("; ");
        for (let p of pairs) {
          if (!p) continue;
          // FIX: Split only on the FIRST "=" to handle values that contain "="
          const eqIndex = p.indexOf("=");
          if (eqIndex < 0) continue;
          const k = p.substring(0, eqIndex);
          const v = p.substring(eqIndex + 1);
          if (decodeURIComponent(k) === "access_token_issued_time") {
            tokenIssuedTime = parseInt(decodeURIComponent(v || ""), 10);
            break;
          }
        }
      }
      
      if (tokenIssuedTime) {
        const tokenAge = Math.floor((Date.now() - tokenIssuedTime) / 1000);
        const tokenExpiresIn = (15 * 60) - tokenAge;
        
        // Refresh token when 1 minute remaining (or if already expired)
        if (tokenExpiresIn <= 60) {
          console.log("\n[Dashboard] Access token expiring soon, proactively refreshing...");
          console.log(`   Token expires in: ${tokenExpiresIn}s`);
          
          try {
            const { refreshAccessToken } = await import("@/services/authservice");
            const newAccessToken = await refreshAccessToken();
            
            if (newAccessToken) {
              authStore.setAccessToken(newAccessToken);
              console.log("\n[Dashboard] Access token refreshed successfully (proactive)");
              console.log(`   New token expires in: 15 minutes`);
            }
          } catch (err) {
            console.error("\n[Dashboard] Failed to proactively refresh token:", err?.message);
          }
        }
      }
    }, 30000); // Check token expiry every 30 seconds

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("auth:refresh-failed", handleAuthRefreshFailed);
      }
      clearInterval(sessionTimer);
      clearInterval(tokenRefreshTimer);
    };
  }, [router]);

  return (
    <>
      <DashboardHeader />
      <div className="flex min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-blue-50/40">
        <Sidebar />
        <main className="flex-1 w-full lg:ml-64 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-[1280px] mr-auto space-y-8">
              {/* Header Section */}
              <div>
                <div className="rounded-2xl border border-blue-400/30 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 p-6 text-white shadow-xl sm:p-8">
                  <h1 className="mb-2 text-3xl font-bold sm:text-4xl">Welcome Back!</h1>
                  <p className="text-base text-blue-100 sm:text-lg">
                    Here&apos;s an overview of your real estate portfolio and latest activities.
                  </p>
                </div>
              </div>

              {/* Main Content */}
              <div className="rounded-2xl border border-gray-200/70 bg-white/90 shadow-lg backdrop-blur">
                <div className="p-6 sm:p-8 md:p-10">
                  {authReady ? (
                    <div className="space-y-8">
                      <div>
                        <h2 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">Your Products</h2>
                        <p className="text-slate-600">Explore and manage your available real estate products</p>
                      </div>
                      <ProductList />
                    </div>
                  ) : (
                    <div className="py-16 text-center space-y-4">
                      <div className="flex justify-center">
                        <div className="relative w-12 h-12">
                          <div className="absolute inset-0 bg-blue-600 rounded-full animate-spin opacity-75"></div>
                          <div className="absolute inset-1 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <p className="text-gray-500 text-lg font-medium">Authenticating session…</p>
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

