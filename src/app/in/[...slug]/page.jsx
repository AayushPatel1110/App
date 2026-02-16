import { notFound } from "next/navigation";

import CountryPage from "@/components/pages/CountryPage";
import StatePage from "@/components/pages/StatePage";
import CityPage from "@/components/pages/CityPage";
import AreaPage from "@/components/pages/AreaPage";
import BusinessDetail from "@/components/pages/BusinessDetail";

/* ---------------- helpers ---------------- */

function toTitle(slug) {
  return String(slug)
    .replace(/[_-]/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function normalizeSlug(slugParam) {
  if (!slugParam && slugParam !== "") return "";
  if (Array.isArray(slugParam)) {
    return slugParam.map((s) => decodeURIComponent(String(s))).join("-");
  }
  return decodeURIComponent(String(slugParam));
}

const KNOWN_STATES = [
  "andaman",
  "andhra",
  "arunachal",
  "assam",
  "bihar",
  "chhattisgarh",
  "delhi",
  "goa",
  "gujarat",
  "haryana",
  "himachal",
  "jammu",
  "jharkhand",
  "karnataka",
  "kerala",
  "ladakh",
  "lakshadweep",
  "madhya",
  "maharashtra",
  "manipur",
  "meghalaya",
  "mizoram",
  "nagaland",
  "odisha",
  "puducherry",
  "punjab",
  "rajasthan",
  "sikkim",
  "tamil",
  "telangana",
  "tripura",
  "uttarakhand",
  "uttar",
  "west",
];

/* ---------------- metadata ---------------- */

export async function generateMetadata({ params }) {
  const resolved = await params;
  const rawSlug = resolved?.slug;
  const slug = normalizeSlug(rawSlug);

  if (!slug) {
    return { title: "SeaNeB" };
  }

  const slugLower = slug.toLowerCase();

  // Area
  if (slugLower.includes("nagar")) {
    const areaName = toTitle(slug);
    return {
      title: `Buy, Sell & Rent Properties in ${areaName} | SeaNeB Real Estate`,
      description: `Find verified property listings in ${areaName}. Browse apartments, houses, and commercial properties with detailed information and reviews.`,
      keywords: `properties in ${areaName}, buy in ${areaName}, sell in ${areaName}, rent in ${areaName}, real estate listings`,
      openGraph: {
        title: `Properties in ${areaName} - SeaNeB`,
        description: `Browse properties in ${areaName} on SeaNeB.`,
        type: "website",
      },
    };
  }

  // City (ahmedabad-gj)
  if (/-[a-z]{2}$/i.test(slug)) {
    const city = toTitle(slug.split("-")[0]);
    return {
      title: `Buy, Sell & Rent Properties in ${city} | SeaNeB Real Estate`,
      description: `Discover residential and commercial properties in ${city}. Find apartments, houses, plots, and shops with prices and detailed information.`,
      keywords: `properties in ${city}, buy property ${city}, sell property ${city}, real estate ${city}`,
      openGraph: {
        title: `Properties in ${city} - SeaNeB`,
        description: `Browse properties in ${city} on SeaNeB.`,
        type: "website",
      },
    };
  }

  // State
  if (KNOWN_STATES.includes(slugLower)) {
    const state = toTitle(slug);
    return {
      title: `Buy, Sell & Rent Properties in ${state} | SeaNeB Real Estate`,
      description: `Find properties across ${state}. Browse verified listings for apartments, houses, commercial properties in major cities.`,
      keywords: `properties in ${state}, real estate ${state}, buy property ${state}, sell property ${state}`,
      openGraph: {
        title: `Properties in ${state} - SeaNeB`,
        description: `Browse properties in ${state} on SeaNeB.`,
        type: "website",
      },
    };
  }

  return {
    title: "Not Found — SeaNeB",
    description: "The page you are looking for could not be found.",
  };
}

/* ---------------- page ---------------- */

export default async function InSlugPage({ params }) {
  const resolved = await params;
  const slug = resolved?.slug || [];

  if (!slug || slug.length === 0) return notFound();

  const parts = slug.map((s) => String(s).toLowerCase());
  const [country, state, city, area] = parts;

  if (parts.length === 1) {
    const single = parts[0];

    if (single && single.length === 2) {
      return <CountryPage countrySlug={single} />;
    }

    if (single && single.includes("nagar")) {
      return <AreaPage areaSlug={single} />;
    }

    if (single && /-[a-z]{2}$/i.test(single)) {
      return <CityPage citySlug={single} />;
    }

    if (single && KNOWN_STATES.includes(single)) {
      return <StatePage stateSlug={single} />;
    }

    return <BusinessDetail businessSlug={single} />;
  }

  if (parts.length === 2) {
    const [stateSlug, citySlug] = parts;
    return <CityPage citySlug={citySlug} />;
  }

  if (parts.length === 3) {
    const areaSlug = parts[2];
    return <AreaPage areaSlug={areaSlug} />;
  }

  return notFound();
}
