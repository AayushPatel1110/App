import MarketingPageShell from "@/components/marketing/shared/MarketingPageShell";
import SectionHeading from "@/components/marketing/shared/SectionHeading";
import StatsGrid from "@/components/marketing/shared/StatsGrid";
import CTASection from "@/components/marketing/shared/CTASection";
import { getAboutPageData } from "@/lib/marketing/getMarketingPageData";

export const metadata = {
  title: "About SeaNeB | Mission, Vision, and Trust",
  description: "Learn SeaNeB's mission, vision, verification model, and how we help users discover verified real estate opportunities.",
  openGraph: {
    title: "About SeaNeB | Mission, Vision, and Trust",
    description: "See how SeaNeB works from search to close with real-estate-first workflows.",
    type: "website",
    url: "https://seaneb.com/about",
  },
};

export default async function AboutPage() {
  const data = await getAboutPageData();

  return (
    <MarketingPageShell>
      <section className="bg-gradient-to-r from-rose-900 via-rose-800 to-orange-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">{data.hero.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{data.hero.title}</h1>
          <p className="mt-4 max-w-3xl text-sm text-rose-100 sm:text-lg">{data.hero.description}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <article className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
          <SectionHeading eyebrow="Mission" title="Our Mission" description={data.mission} />
        </article>
        <article className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
          <SectionHeading eyebrow="Vision" title="Our Vision" description={data.vision} />
        </article>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Workflow"
          title="How SeaNeB Works"
          description="A simple real-estate flow: Search, Connect, and Close."
        />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {data.workflow.map((item, idx) => (
            <article key={item.step} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Step {idx + 1}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.step}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Verification"
          title="How We Build Trust"
          description="Verification is embedded into listing quality and partner reliability."
        />
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {data.verification.map((item) => (
            <p key={item} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
              {item}
            </p>
          ))}
        </div>
      </section>

      <StatsGrid stats={data.stats} />

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Team"
          title="The Team Behind SeaNeB"
          description="Cross-functional teams focused on trust, quality, and growth."
        />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {data.team.map((member) => (
            <article key={member.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{member.role}</p>
              <p className="mt-3 text-sm text-slate-700">{member.focus}</p>
            </article>
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
