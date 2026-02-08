import { useMemo } from "react";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import ProductCarousel from "./product-carousel";

export function HeroBackground() {
  const baseImages = ["/images/hero/sias.png"];
  const images = useMemo(() => {
    return Array.from(
      { length: 31 },
      (_, i) => baseImages[i % baseImages.length],
    );
  }, []);

  return (
    <div className="relative mx-auto flex h-screen w-full flex-col items-center justify-center">
      <ProductCarousel />
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 h-full w-full rounded-none z-0"
        images={images}
      />
      {/* Overlay */}
      <div className="absolute inset-0 z-10 h-full w-full bg-gradient-to-b from-transparent to-white dark:to-[#004580]" />
    </div>
  );
}
