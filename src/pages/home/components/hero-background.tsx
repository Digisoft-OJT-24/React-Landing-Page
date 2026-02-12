import { useMemo, lazy } from "react";
const HeroParallax = lazy(() =>
  import("@/components/ui/hero-parallax").then((mod) => ({
    default: mod.HeroParallax,
  })),
);

export function HeroBackground() {
  const baseImages = ["/images/hero/sias.png"].flatMap((img) =>
    Array(10).fill(img),
  );
  const products = useMemo(() => {
    return baseImages.map((src) => ({
      title: "SIAS",
      link: "",
      thumbnail: src,
    }));
  }, [baseImages]);

  return (
    // <div className="relative mx-auto flex h-screen w-full flex-col items-center justify-center">
    //   {/* <ProductCarousel /> */}
    //   {/* <ThreeDMarquee
    //     className="pointer-events-none absolute inset-0 h-full w-full rounded-none z-0"
    //     images={images}
    //   /> */}
    //   {/* Overlay */}
    //   {/* <div className="absolute inset-0 z-10 h-full w-full bg-gradient-to-b from-transparent to-white dark:to-[#004580]" /> */}
    // </div>
    <HeroParallax products={products} />
  );
}
