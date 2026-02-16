import MarketingPageShell from "@/components/marketing/shared/MarketingPageShell";
import PageLoadingSkeleton from "@/components/marketing/shared/PageLoadingSkeleton";

export default function Loading() {
  return (
    <MarketingPageShell>
      <PageLoadingSkeleton />
    </MarketingPageShell>
  );
}
