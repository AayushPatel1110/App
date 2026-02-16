"use client"

import Link from "next/link";
import LanguageDropdown from "./LanguageDropdown";
import BrandLogo from "./BrandLogo";
import eng from "@/constants/i18/eng.json";
import guj from "@/constants/i18/guj.json";
import hindi from "@/constants/i18/hindi.json";

const LANG_MAP = { eng, guj, hindi };

export default function AuthHeader({ language, setLanguage }) {
  const labels = LANG_MAP[language] || eng;

  return (
    <header className="relative w-full pb-4">
      <div className="absolute top-0 right-0 z-50">
        <LanguageDropdown language={language} onChange={setLanguage} labels={labels} />
      </div>

      <Link href="/" className="hover:opacity-80 transition" onClick={(e) => e.stopPropagation()}>
        <BrandLogo
          size={48}
          titleClass="logo-text"
          subtitleClass="logo-subtext"
        />
      </Link>
    </header>
  );
}
