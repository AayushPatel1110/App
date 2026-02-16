import BusinessDetail from "@/components/pages/BusinessDetail";

export async function generateMetadata({ params }) {
  const resolved = await params;
  const slug = resolved?.slug;
  const title = slug ? `${slug.replace(/[-_]/g, " ")} - Business Details | SeaNeB` : "Business Details - SeaNeB";
  
  return {
    title,
    description: "View detailed business information, reviews, and services on SeaNeB.",
    keywords: "business details, real estate business, services, reviews",
    openGraph: {
      title,
      description: "View detailed business information on SeaNeB.",
      type: "website",
    },
  };
}

export default async function RootSlugPage({ params }) {
  const resolved = await params;
  let slug = resolved?.slug;
  if (!slug) return null;
  if (Array.isArray(slug)) slug = slug.join("-");

  return <BusinessDetail businessSlug={slug} />;
}
