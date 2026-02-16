import MarketingPageShell from "@/components/marketing/shared/MarketingPageShell";
import SectionHeading from "@/components/marketing/shared/SectionHeading";
import CTASection from "@/components/marketing/shared/CTASection";
import { getSolutionPageData } from "@/lib/marketing/getMarketingPageData";

export const metadata = {
  title: "SeaNeB Solutions | Smarter Real Estate Workflows",
  description: "Discover how SeaNeB solves traditional real estate problems with smart search, alerts, and verified listing workflows.",
  openGraph: {
    title: "SeaNeB Solutions | Smarter Real Estate Workflows",
    description: "Explore SeaNeB's feature stack for brokers, builders, agents, and seekers.",
    type: "website",
    url: "https://seaneb.com/solution",
  },
};

export default async function SolutionPage() {
  const data = await getSolutionPageData();

  return (
    <MarketingPageShell>
      <section className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">{data.hero.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{data.hero.title}</h1>
          <p className="mt-4 max-w-3xl text-sm text-emerald-100 sm:text-lg">{data.hero.description}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <article className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
          <SectionHeading eyebrow="Pain Points" title="Traditional Real Estate Problems" />
          <ul className="mt-4 space-y-2">
            {data.problems.map((item) => (
              <li key={item} className="text-sm text-rose-900">- {item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <SectionHeading eyebrow="SeaNeB Approach" title="How SeaNeB Solves It" />
          <ul className="mt-4 space-y-2">
            {data.solutions.map((item) => (
              <li key={item} className="text-sm text-emerald-900">- {item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Core Features"
          title="Feature Highlights"
          description="Built for practical, high-intent property discovery and conversion."
        />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {data.features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Workflow"
          title="App Workflow"
          description="A repeatable flow from listing to lead conversion."
        />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {data.workflow.map((item, index) => (
            <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-semibold text-white">
                {index + 1}
              </span>
              <p className="text-sm text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Benefits"
          title="Business and User Benefits"
          description="SeaNeB improves speed, quality, and trust across the property lifecycle."
        />
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {data.benefits.map((item) => (
            <p key={item} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
              {item}
            </p>
          ))}
        </div>
      </section>

      <CTASection
        title={data.cta.title}
        description={data.cta.description}
        primary={data.cta.primary}
        secondary={data.cta.secondary}
      />
    </MarketingPageShell>
  );
}
