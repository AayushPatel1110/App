import MarketingPageShell from "@/components/marketing/shared/MarketingPageShell";
import SectionHeading from "@/components/marketing/shared/SectionHeading";
import BlogListingSection from "@/components/marketing/blogs/BlogListingSection";
import { getBlogsPageData } from "@/lib/marketing/getMarketingPageData";

export const metadata = {
  title: "SeaNeB Blogs | Real Estate News and Guides",
  description: "Search property blogs, filter by category, and stay updated with real estate market insights from SeaNeB.",
  openGraph: {
    title: "SeaNeB Blogs | Real Estate News and Guides",
    description: "Read practical content on buying, renting, commercial trends, and broker growth.",
    type: "website",
    url: "https://seaneb.com/blogs",
  },
};

export default async function BlogsPage() {
  const data = await getBlogsPageData();

  return (
    <MarketingPageShell>
      <section className="bg-gradient-to-r from-amber-900 via-amber-700 to-orange-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">{data.hero.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{data.hero.title}</h1>
          <p className="mt-4 max-w-3xl text-sm text-amber-100 sm:text-lg">{data.hero.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Insights"
          title="Discover Latest Posts"
          description="Use search and filters to find relevant articles quickly."
        />
      </section>

      <BlogListingSection
        categories={data.categories}
        posts={data.posts}
        popular={data.popular}
        newsletter={data.newsletter}
      />
    </MarketingPageShell>
  );
}
