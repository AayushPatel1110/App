import CountryPage from "@/components/pages/CountryPage";

export const metadata = {
  title: "Buy, Sell & Rent Properties in India - SeaNeB Real Estate",
  description:
    "Explore residential and commercial real estate listings across India with SeaNeB. Find apartments, houses, commercial spaces in major cities.",
  keywords: "properties in India, buy property India, sell property India, rent property, real estate listings",
  openGraph: {
    title: "Properties in India - SeaNeB",
    description: "Browse thousands of property listings across India.",
    type: "website",
  },
};

export default function InPage() {
  // Default country landing page: India
  return <CountryPage countrySlug="india" />;
}
