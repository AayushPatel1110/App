"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import eng from "@/constants/i18/eng.json";
import guj from "@/constants/i18/guj.json";
import hindi from "@/constants/i18/hindi.json";

import OtpInput from "@/components/ui/OtpInput";
import OtpCard from "@/components/ui/OtpCard";

const LANG_MAP = { eng, guj, hindi };

export default function OtpPage() {
  const router = useRouter();
  const [language, setLanguage] = useState("eng");
  const [otpValue, setOtpValue] = useState("");

  const t = LANG_MAP[language];

  const verifyOtp = () => {
    if (otpValue.length !== 4) return;
    router.push("/auth/success");
  };

  return (
    <OtpCard
      title={t.otpTitle}
      submitText={t.verifyOtp}
      disabled={otpValue.length !== 4}
      onSubmit={verifyOtp}
    >
      {/* Header */}
      <div className="auth-header">
        <div className="brand">
          <div className="brand-dot" />
          SeaNeB
        </div>

        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="lang-select"
        >
          <option value="eng">ENG</option>
          <option value="guj">GUJ</option>
          <option value="hindi">HIN</option>
        </select>
      </div>

      <div className="auth-title">{t.otpTitle}</div>

      <div className="auth-subtitle">
        {t.otpSubtitle} <span className="phone">8160026509</span>
      </div>

      <OtpInput length={4} onComplete={setOtpValue} />

      <div className="mt-4 text-sm text-gray-500">
        <span className="cursor-pointer hover:text-black">
          {t.resendOtp}
        </span>
      </div>
    </OtpCard>
  );
}
