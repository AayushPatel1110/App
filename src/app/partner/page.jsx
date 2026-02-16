import MarketingPageShell from "@/components/marketing/shared/MarketingPageShell";
import SectionHeading from "@/components/marketing/shared/SectionHeading";
import CTASection from "@/components/marketing/shared/CTASection";
import PartnerRegistrationForm from "@/components/marketing/forms/PartnerRegistrationForm";
import { getPartnerPageData } from "@/lib/marketing/getMarketingPageData";

export const metadata = {
  title: "Partner with SeaNeB | Broker, Builder, Agent Growth",
  description: "Join SeaNeB partner network with role-based plans, dashboard workflows, and verified real estate visibility.",
  openGraph: {
    title: "Partner with SeaNeB | Broker, Builder, Agent Growth",
    description: "Explore partner types, pricing plans, and onboarding flow for SeaNeB.",
    type: "website",
    url: "https://seaneb.com/partner",
  },
};

export default async function PartnerPage() {
  const data = await getPartnerPageData();

  return (
    <MarketingPageShell>
      <section className="bg-gradient-to-r from-sky-900 via-blue-800 to-cyan-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">{data.hero.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{data.hero.title}</h1>
          <p className="mt-4 max-w-3xl text-sm text-sky-100 sm:text-lg">{data.hero.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Types"
          title="Partner Types"
          description="SeaNeB supports brokers, builders, and agents with role-specific growth workflows."
        />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {data.partnerTypes.map((item) => (
            <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-700">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Benefits"
          title="Why Partner With SeaNeB"
          description="Designed to improve visibility, lead quality, and response operations."
        />
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {data.benefits.map((item) => (
            <p key={item} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Dashboard"
          title="Partner Dashboard Preview"
          description="Track listing performance, inquiries, and market movement in one workspace."
        />
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {data.dashboardPreview.map((item) => (
              <div key={item} className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Plans"
          description="Pick a plan aligned with your growth stage."
        />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {data.plans.map((plan) => (
            <article key={plan.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
              <p className="mt-2 text-2xl font-bold text-slate-900">{plan.price}</p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-sm text-slate-700">- {feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <PartnerRegistrationForm />
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
