import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CircleSmall } from "lucide-react";

// import { CenterOverlay } from "@/components/custom/center-overlay";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Integrated Systems",
      description: "Most Complete & Fully Integrated Systems",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800 p-4 sm:p-8 ",
    },
    {
      title: "Learning Management System",
      description:
        "The FIRST and ONLY school software with INTEGRATED Learning Management System",
      skeleton: <SkeletonTwo />,
      className:
        "border-b col-span-1 lg:col-span-2 dark:border-neutral-800 p-4 sm:p-8 ",
    },
    {
      title: "Continuous & Active Development",
      description:
        "The ONLY school software that is CONTINUOUSLY IMPROVED (Since 1998) DOWNLOADABLE, UPGRADEABLE UNIFIED SYSTEM",
      skeleton: <SkeletonThree />,
      className:
        "col-span-1 lg:col-span-3 lg:border-r  dark:border-neutral-800 p-4 sm:p-8 ",
    },
    {
      title: "Cross-Platform",
      description:
        "The ONLY school software which is 100% Desktop and MOBILE friendly (ALL User Interfaces: Admin, Trans, Tools & Reports)",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 lg:border-none p-4 sm:p-8 ",
    },
  ];
  return (
    <section className="w-full relative p-0 m-0">
      {/* <CenterOverlay /> */}
      <AnimatedFeatureCard>
        <div className="w-full xs:h-[120px] sm:h-[200px] md:h-[300px] lg:h-[400px] xl:h-[400px] 2xl:h-[460px] bg-[url('/images/overlay/center.svg')] bg-cover bg-no-repeat bg-center p-0 m-0"></div>
      </AnimatedFeatureCard>

      {/* CONTENT  */}
      <div className="relative z-20 pt-10 max-w-7xl mx-auto">
        <AnimatedFeatureCard className="px-8">
          <h4 className="xs:text-4xl sm:xs:text-4xl md:xs:text-4xl lg:text-5xl xl:text-5xl 2xl:text-5xl font-semibold lg:leading-tight max-w-5xl mx-auto text-center tracking-tight text-[#ffa500]">
            SIAS ONLINE (3.x)
          </h4>

          <p className="xs:text-sm sm:text-md md:text-lg lg:text-lg xl:text-lg 2xl:text-lg max-w-2xl my-4 mx-auto text-[#16294a] dark:text-white text-center font-semibold">
            The best and no. 1 school management system in the Philippines.
          </p>
        </AnimatedFeatureCard>

        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800">
            {features.map((feature) => (
              <AnimatedFeatureCard
                key={feature.title}
                className={feature.className}
              >
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
                <div className=" h-full w-full">{feature.skeleton}</div>
              </AnimatedFeatureCard>
            ))}
          </div>
        </div>
      </div>

      {/* OVERLAY BOTTOM */}
      <div className="w-full xs:h-[120px] sm:h-[200px] md:h-[400px] lg:h-[400px] xl:h-[400px] 2xl:h-[400px] bg-[url('/images/overlay/bottom.svg')] bg-cover bg-no-repeat bg-bottom p-0 m-0"></div>
    </section>
  );
}

const AnimatedFeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const { ref } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(`relative overflow-hidden`, className)}
    >
      {children}
    </motion.div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className=" max-w-5xl mx-auto text-left tracking-tight text-[#ffa500] font-semibold text-xl md:text-2xl md:leading-snug uppercase">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base  max-w-4xl text-left mx-auto",
        "text-[#16294a] text-center font-medium dark:text-white",
        "text-left max-w-sm mx-0 md:text-sm my-2",
      )}
    >
      {children}
    </p>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex py-5 px-2 gap-10 h-auto">
      <div className="w-full mx-auto h-full flex justify-center items-center">
        {/* TODO */}
        <img
          src="/images/list-of-products.png"
          alt="list-of-produtcs"
          className="object-center py-5 bg-blend-multiply"
        />
      </div>
    </div>
  );
};

export const SkeletonTwo = () => {
  return (
    <div className="w-full h-auto mx-auto group">
      <div className="flex flex-1 w-full h-auto flex-col space-y-2 relative mt-10">
        {/* TODO */}
        <img
          src="/images/lms.png"
          alt="header"
          className="object-cover object-center mx-auto pt-4"
        />
      </div>
    </div>
  );
};

export const SkeletonThree = () => {
  return (
    <div className="w-full mx-auto bg-transparent dark:bg-transparent group h-full">
      <div className="flex flex-1 w-full h-full flex-col space-y-2  relative">
        {/* TODO */}
        <div className="font-semibold w-full px-2 sm:px-4">
          <center className="underline text-lg">
            The Evolution of SIAS Online 3.x
          </center>
          <div className="mt-4 space-y-2">
            {/* ROW 1 */}
            <>
              <div className="flex gap-2 text-sm sm:text-base">
                <span className="text-red-500">1998:</span>
                <span>SIS 1.X: LAN-based, CUSTOMIZED System</span>
              </div>
              <div className="flex flex-col gap-0 text-xs sm:text-sm">
                <span className="flex items-center">
                  <CircleSmall /> Implemented at St. Paul University Philippines
                  (SPUP)
                </span>
                <span className="flex items-center">
                  <CircleSmall /> After{" "}
                  <span className="ms-1 text-red-500">25 years</span>, SPUP is
                  still our client today
                </span>
              </div>
            </>

            {/* ROW 2 */}
            <>
              <div className="flex gap-2 text-sm sm:text-base">
                <span className="text-red-500">2003:</span>
                <span>
                  SIAS 2.X: VPF 9.0,
                  <span className="ms-1 text-red-500">UNIFIED System</span>
                </span>
              </div>
              <div className="flex flex-col gap-0 text-xs sm:text-sm">
                <span className="flex items-center">
                  <CircleSmall /> Implemented at Kalinga State University (KSU)
                </span>
                <span className="flex items-center">
                  <CircleSmall /> After
                  <span className="ms-1 text-red-500">20 years</span>, KSU is
                  still our client today
                </span>
                <span className="flex items-center">
                  <CircleSmall /> Used by
                  <span className="mx-1 text-red-500">100+</span> schools
                  nationwide
                </span>
              </div>
            </>

            {/* ROW 3 */}
            <>
              <div className="flex gap-2 text-sm sm:text-base">
                <span className="text-red-500">2014:</span>
                <span>
                  SIAS Online 3.X:
                  <span className="mx-1 text-red-500">UNIFIED System</span>
                  for SUCs / Private
                </span>
              </div>
              <div className="flex flex-col gap-0 text-xs sm:text-sm">
                <span className="flex items-center">
                  <CircleSmall /> Free upgrade many old existing clients to the
                  cloud (1-Day Upgrade)
                </span>
                <span className="flex items-center">
                  <CircleSmall /> Free cloud server offered to all clients
                </span>
              </div>
            </>

            {/* ROW 4 */}
            <>
              <div className="flex gap-2 text-sm sm:text-base">
                <span className="text-red-500">2018:</span>
                <span>
                  SIAS Online 3.3:
                  <span className="mx-1 text-red-500">UNIFIED System</span>
                  for SUCs / Private / DepED
                </span>
              </div>
              <div className="flex flex-col gap-0 text-xs sm:text-sm">
                <span className="flex items-center">
                  <CircleSmall /> Added support for DepED specific operations
                </span>
                <span className="flex items-center">
                  <CircleSmall /> Added support for Senior High School
                </span>
                <span className="flex items-center">
                  <CircleSmall /> Added integrated Learning Management System
                </span>
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonFour = () => {
  return (
    <div className="h-auto flex flex-col items-center relative bg-transparent dark:bg-transparent ">
      <img
        src="/images/availability.png"
        alt="header"
        className="object-cover object-center mx-auto"
      />
    </div>
  );
};
// export const Globe = ({ className }: { className?: string }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     let phi = 0;

//     if (!canvasRef.current) return;

//     const globe = createGlobe(canvasRef.current, {
//       devicePixelRatio: 2,
//       width: 600 * 2,
//       height: 600 * 2,
//       phi: 0,
//       theta: 0,
//       dark: 1,
//       diffuse: 1.2,
//       mapSamples: 16000,
//       mapBrightness: 6,
//       baseColor: [0.3, 0.3, 0.3],
//       markerColor: [0.1, 0.8, 1],
//       glowColor: [1, 1, 1],
//       markers: [
//         // longitude latitude
//         { location: [37.7595, -122.4367], size: 0.03 },
//         { location: [40.7128, -74.006], size: 0.1 },
//       ],
//       onRender: (state) => {
//         // Called on every animation frame.
//         // `state` will be an empty object, return updated params.
//         state.phi = phi;
//         phi += 0.01;
//       },
//     });

//     return () => {
//       globe.destroy();
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
//       className={className}
//     />
//   );
// };
