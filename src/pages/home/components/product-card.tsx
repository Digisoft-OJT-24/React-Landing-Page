import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProductCardProps {
  title: string;
  description: string;
  link: string;
}

export default function ProductCard({
  title,
  description,
  link,
}: ProductCardProps) {
  return (
    <>
      <section className="flex flex-col justify-center items-center h-full">
        <h1 className="2xl:text-5xl xs:text-2xl sm:xs:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-[#ffa500] 2xl:mb-6 xs:mb-2 cursor-default select-none text-center">
          {`${title}`}
        </h1>
        <span className="w-full xl:w-[40%] uppercase 2xl:text-4xl xl:text-2xl xs:text-xs font-bold text-center 2xl:mb-10 xs:mb-4 cursor-default select-none text-[#16294a] dark:text-white">
          {description}
        </span>
        <Button className="w-[130px] xs:text-xs uppercase text-white bg-[#16294a] hover:bg-[#034383] focus:bg-[#16294a]">
          <Link to={link}>View More</Link>
        </Button>
      </section>
    </>
  );
}
