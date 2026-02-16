"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import phoneCodes from "@/constants/phoneCodes.json";
import BrandLogo from "@/components/ui/BrandLogo";
import navbarLinks from "@/data/navbarLinks.json";

export default function HomePage() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
      setCanInstall(false);
    }
  };

  const countryList = ["India", "United States", "Australia", "Singapore"];
  const navLinks = navbarLinks;

  return (
    <div className={`min-h-screen transition-colors ${isDark ? "bg-gradient-to-b from-black via-zinc-950 to-black text-slate-100" : "bg-gradient-to-b from-slate-50 to-white text-slate-900"}`}>
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/95 backdrop-blur transition-colors">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/home" className="transition-opacity hover:opacity-90">
            <BrandLogo
              size={44}
              titleClass="text-lg font-bold text-white"
              subtitleClass="text-xs text-slate-400"
            />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm font-medium text-slate-300 transition-colors hover:text-white">
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              className="rounded-full border border-slate-600 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-100 transition-colors hover:bg-slate-700 sm:text-sm"
            >
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>
            {canInstall && (
              <button
                type="button"
                onClick={handleInstall}
                className="hidden rounded-full border border-cyan-700 bg-cyan-900/40 px-4 py-2 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-900/70 sm:inline-block"
              >
                Install App
              </button>
            )}
            <Link
              href="/auth/login"
              className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? "bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.18),transparent_38%),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.16),transparent_42%)]" : "bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.18),transparent_38%),radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.16),transparent_42%)]"}`} />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div className="space-y-6">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${isDark ? "border border-slate-700 bg-slate-900 text-slate-200" : "border border-slate-300 bg-white text-slate-700"}`}>
              Trusted Real Estate Discovery
            </span>
            <h1 className={`text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl ${isDark ? "text-white" : "text-slate-900"}`}>
              Find Properties Near You, Faster
            </h1>
            <p className={`max-w-xl text-base leading-relaxed sm:text-lg ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Search verified apartments, houses, and commercial properties with one clean flow. Compare locations and connect quickly.
            </p>

            <div className={`rounded-2xl p-3 shadow-sm ${isDark ? "border border-slate-700 bg-slate-900/90" : "border border-slate-200 bg-white"}`}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  placeholder="Search by city, area, or pincode"
                  className={`h-11 w-full rounded-xl border px-4 text-sm outline-none transition-all ${isDark ? "border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-900/60" : "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"}`}
                />
                <button className={`h-11 rounded-xl px-6 text-sm font-semibold transition-all ${isDark ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 hover:from-cyan-400 hover:to-blue-400" : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"}`}>
                  Search
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {["Apartments", "Villas", "Commercial", "Plots"].map((tag) => (
                <span key={tag} className={`rounded-full px-3 py-1 text-xs font-medium ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className={`relative w-full max-w-md rounded-3xl p-6 shadow-xl ${isDark ? "border border-slate-700 bg-slate-900" : "border border-slate-200 bg-white"}`}>
              <div className="mb-4 flex items-center justify-between">
                <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Top Match</p>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Verified</span>
              </div>
              <div className={`mb-4 h-40 rounded-2xl ${isDark ? "bg-gradient-to-br from-slate-700 to-slate-800" : "bg-gradient-to-br from-slate-200 to-slate-300"}`} />
              <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>SeaNeB Premium Apartment</h3>
              <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>2 BHK, city center, near metro</p>
              <div className="mt-4 flex items-center justify-between">
                <span className={`text-lg font-bold ${isDark ? "text-cyan-300" : "text-blue-700"}`}>INR 58,00,000</span>
                <button className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${isDark ? "border border-cyan-700 bg-cyan-900/40 text-cyan-200 hover:bg-cyan-900/70" : "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"}`}>
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-14 sm:py-16 ${isDark ? "bg-black" : "bg-white"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className={`text-3xl font-bold sm:text-4xl ${isDark ? "text-white" : "text-slate-900"}`}>Browse by Property Type</h2>
            <p className={`mt-3 ${isDark ? "text-slate-300" : "text-slate-600"}`}>Choose the format that fits your buying goals.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {[
              { icon: "/icons/apartment.svg", label: "Apartments" },
              { icon: "/icons/house.svg", label: "Houses" },
              { icon: "/icons/commercial.svg", label: "Commercial" },
              { icon: "/icons/land.svg", label: "Land" },
            ].map((cat) => (
              <button
                key={cat.label}
                className={`group rounded-2xl p-5 text-center transition-all hover:-translate-y-1 hover:shadow-lg ${isDark ? "border border-slate-700 bg-gradient-to-b from-slate-900 to-slate-800 hover:border-cyan-500" : "border border-slate-200 bg-gradient-to-b from-white to-slate-50 hover:border-blue-300"}`}
              >
                <div className="mb-3 flex justify-center">
                  <img src={cat.icon} alt={cat.label} className="h-11 w-11 transition-transform group-hover:scale-110" />
                </div>
                <p className={`text-sm font-semibold sm:text-base ${isDark ? "text-slate-100" : "text-slate-900"}`}>{cat.label}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-14 sm:py-16 ${isDark ? "bg-zinc-950" : "bg-slate-50"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className={`text-3xl font-bold sm:text-4xl ${isDark ? "text-white" : "text-slate-900"}`}>Available Countries</h2>
            <p className={`mt-3 ${isDark ? "text-slate-300" : "text-slate-600"}`}>Explore listings across multiple regions.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {countryList.map((name) => {
              const info = phoneCodes.find((p) => p.name === name) || {};
              const flag = info.flag || `/icons/${name.toLowerCase().replace(/[^a-z]/g, "")}.svg`;
              return (
                <button
                  key={name}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${isDark ? "border border-slate-700 bg-slate-800 text-slate-100 hover:border-cyan-500 hover:bg-slate-700" : "border border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-blue-50"}`}
                >
                  <img src={flag} alt={name} className="h-4 w-6 object-contain" />
                  <span>{name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="download" className={`py-16 ${isDark ? "bg-black" : ""}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 gap-10 rounded-3xl p-8 text-white shadow-xl lg:grid-cols-2 lg:p-12 ${isDark ? "border border-zinc-800 bg-gradient-to-r from-zinc-900 to-slate-900" : "bg-gradient-to-r from-blue-700 to-cyan-600"}`}>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold sm:text-4xl">Get SeaNeB on Your Phone</h3>
              <p className="text-blue-100">
                Use the app to track listings, save favorites, and receive updates instantly.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold ${isDark ? "bg-cyan-500 text-black hover:bg-cyan-400" : "bg-white text-blue-700 hover:bg-blue-50"}`}
                >
                  Google Play
                </a>
                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold ${isDark ? "bg-cyan-500 text-black hover:bg-cyan-400" : "bg-white text-blue-700 hover:bg-blue-50"}`}
                >
                  App Store
                </a>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className={`w-48 rounded-3xl p-5 text-center shadow-2xl ${isDark ? "border border-zinc-700 bg-zinc-900 text-slate-100" : "bg-white text-slate-700"}`}>
                <div className={`mx-auto mb-3 h-20 w-20 rounded-2xl ${isDark ? "bg-zinc-800" : "bg-slate-100"}`} />
                <p className="text-sm font-semibold">Mobile Experience</p>
                <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Fast search, alerts, and saved listings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-14 text-white sm:py-16 ${isDark ? "bg-black" : "bg-slate-900"}`}>
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to Find Your Next Property?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            Join SeaNeB and discover verified opportunities in your preferred location.
          </p>
          <Link href="/auth/login" className={`mt-6 inline-block rounded-xl px-7 py-3 text-sm font-semibold transition-colors ${isDark ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400" : "bg-white text-slate-900 hover:bg-slate-100"}`}>
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}

