"use client";

import MarketingPageShell from "@/components/marketing/shared/MarketingPageShell";
import PageErrorState from "@/components/marketing/shared/PageErrorState";

export default function Error({ error, reset }) {
  return (
    <MarketingPageShell>
      <PageErrorState message={error?.message} reset={reset} />
    </MarketingPageShell>
  );
}
