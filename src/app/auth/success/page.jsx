"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";

import eng from "@/constants/i18/eng.json";
import guj from "@/constants/i18/guj.json";
import hindi from "@/constants/i18/hindi.json";

import AuthCard from "@/components/ui/AuthCard";
import LanguageDropdown from "@/components/ui/LanguageDropdown";

const LANG_MAP = { eng, guj, hindi };

export default function SuccessPage() {
  const router = useRouter();
  const [language, setLanguage] = useState("eng");
  const [animationData, setAnimationData] = useState(null);
  const [animationError, setAnimationError] = useState(false);

  const t = LANG_MAP[language];

  useEffect(() => {
    fetch("/Lottie/success.json")
      .then((res) => {
        if (!res.ok) throw new Error("Lottie JSON not found");
        return res.json();
      })
      .then(setAnimationData)
      .catch(() => setAnimationError(true));
  }, []);

  return (
    <AuthCard
      width="460px"
      square
      header={
        <div className="flex items-center justify-between w-full mb-4">
          <div className="brand">
            <div className="brand-dot" />
            SeaNeB
          </div>

          <LanguageDropdown
            language={language}
            onChange={setLanguage}
          />
        </div>
      }
    >
      {/* Animation */}
      <div className="flex justify-center mb-4">
        {animationData && (
          <Lottie
            animationData={animationData}
            loop
            autoplay
            style={{ width: 220, height: 220 }}
          />
        )}

        {animationError && (
          <div
            style={{ width: 220, height: 220 }}
            className="flex items-center justify-center text-green-600 text-5xl"
          >
            ✓
          </div>
        )}
      </div>

      {/* Text */}
      <div>
        <div className="auth-title">
          {t.successTitle || "Registration Successful"}
        </div>

        <div className="auth-subtitle">
          {t.successSubtitle ||
            "Your profile has been completed successfully."}
        </div>
      </div>

      {/* Action */}
      <button
        onClick={() => router.push("/dashboard")}
        className="primary-btn"
      >
        {t.goToDashboard || "Go to Dashboard"}
      </button>
    </AuthCard>
  );
}
