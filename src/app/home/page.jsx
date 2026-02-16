import MarketingPageShell from "@/components/marketing/shared/MarketingPageShell";
import PropertySearchWidget from "@/components/marketing/home/PropertySearchWidget";
import CountriesSection from "@/components/marketing/home/CountriesSection";
import DownloadAppSection from "@/components/marketing/home/DownloadAppSection";
import { getHomePageData } from "@/lib/marketing/getMarketingPageData";
import countries from "@/data/navpages/countries.json";

export const metadata = {
  title: "SeaNeB Home | Verified Real Estate Discovery",
  description: "Search verified buy, rent, and commercial listings with SeaNeB's local-first real estate experience.",
  openGraph: {
    title: "SeaNeB Home | Verified Real Estate Discovery",
    description: "Find trusted listings, trending localities, and direct broker connections on SeaNeB.",
    type: "website",
    url: "https://seaneb.com/home",
  },
};

export default async function HomePage() {
  const data = await getHomePageData();
  const selectedCountries = data.countriesSection?.countries || [];
  const countriesToShow = selectedCountries.length
    ? countries.filter((country) => selectedCountries.includes(country.name))
    : countries;

  return (
    <MarketingPageShell>
      <section className="bg-[radial-gradient(circle_at_12%_18%,rgba(45,212,191,0.22),transparent_34%),radial-gradient(circle_at_88%_8%,rgba(99,102,241,0.2),transparent_38%),linear-gradient(to_right,#020617,#0b1226,#172554)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Home</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{data.hero.title}</h1>
          <p className="mt-4 max-w-3xl text-sm text-slate-200 sm:text-lg">{data.hero.description}</p>

          <div className="mt-10 w-full">
            <PropertySearchWidget searchSection={data.searchSection} />
          </div>
        </div>
      </section>

      <div className="pt-10">
        <CountriesSection
          countries={countriesToShow}
          title={data.countriesSection?.title}
          description={data.countriesSection?.description}
        />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">{data.homeInfoSection?.eyebrow}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{data.homeInfoSection?.title}</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">{data.homeInfoSection?.description}</p>
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            {(data.homeInfoSection?.points || []).map((point) => (
              <p key={point} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {point}
              </p>
            ))}
          </div>
        </div>
      </section>
      <DownloadAppSection section={data.downloadAppSection} />
    </MarketingPageShell>
  );
}
