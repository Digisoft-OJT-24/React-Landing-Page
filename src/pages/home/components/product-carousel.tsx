import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ProductCard from "./product-card";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { GetAllProductsQuery } from "@/hooks/use-queries";

export default function ProductCarousel() {
  const { data } = GetAllProductsQuery();
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <>
      <Carousel
        plugins={[plugin.current]}
        className="h-full w-full flex items-center justify-center relative m-0 p-0 z-20 bg-transparent"
      >
        <CarouselContent>
          {data &&
            data.getProducts.map((product, index: number) => (
              <CarouselItem key={index}>
                <ProductCard
                  title={`${product.title} (${product.code})`}
                  description={product.short}
                  link={`/products/${product.code}`}
                />
              </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>
    </>
  );
}
