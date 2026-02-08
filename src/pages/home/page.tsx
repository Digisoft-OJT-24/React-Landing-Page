import { lazy } from "react";
const PageLayout = lazy(() => import("@/components/custom/layout"));
const FeaturesSectionDemo = lazy(() =>
  import("./components/feature-card").then((module) => ({
    default: module.FeaturesSectionDemo,
  })),
);
const HeroBackground = lazy(() =>
  import("./components/hero-background").then((module) => ({
    default: module.HeroBackground,
  })),
);

export default function HomePage() {
  return (
    <PageLayout className="bg-white dark:bg-[#004580]" hasNavbar>
      <HeroBackground />
      <FeaturesSectionDemo />
    </PageLayout>
  );
}
