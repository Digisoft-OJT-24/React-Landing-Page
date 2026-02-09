import { Link, useParams } from "react-router-dom";
import PageLayout from "@/components/custom/layout";
import { Check } from "lucide-react";
import ContentCard from "@/components/custom/content/content-card";
import ContentHeader from "@/components/custom/content/content-header";
import { DownloadVersion } from "./components/download-combobox";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ModeToggle } from "@/components/mode-toggle";
import MobileNav from "../../components/custom/mobile-nav";
import { useEffect, useMemo } from "react";
import request, { gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types";
import ViewReleaseNotesTextArea from "../release-notes/components/modal";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorPage from "@/components/custom/page/ErrorPage";
import { format } from "date-fns";
import { api_url } from "@/api_url";

export default function ProductPreview() {
  const { id } = useParams();

  // Auto Scroll to Top on Page Load and when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id]);

  // Query
  type GetProductDetailsData = {
    getProducts: (Product & {
      changeLogs: {
        revision: string;
        version: string;
        description: string;
        date: string;
      }[];
      faqs: { faq: string }[];
      downloads: { link: string; title: string }[];
      versions: { link: string; version: string }[];
    })[];
  };

  const GetProductDetailDocument = gql`
    query {
      getProducts(where: { code: { eq: "${id?.toUpperCase()}" } }) {
        changeLogs {
          revision
          version
          description
          date
        }
        code
        title
        short
        faqs {
          faq
        }
        downloads {
          link
          title
        }
        versions {
          link
          version
        }
      }
    }
  `;

  const {
    data: details,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product-details", id],
    queryFn: async () =>
      request<GetProductDetailsData>(
        api_url,
        GetProductDetailDocument,
      ),
  });

  const productDetailsByCode = useMemo(() => {
    if (!details?.getProducts) return {};
    return details.getProducts.reduce(
      (map, product) => {
        if (product.code) {
          map[product.code] = {
            faqs: product.faqs || [],
            downloads: product.downloads || [],
            versions: product.versions || [],
            changeLogs: product.changeLogs
              ? product.changeLogs
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
                  )
              : [],
          };
        }
        return map;
      },
      {} as Record<
        string,
        {
          faqs: { faq: string }[];
          downloads: { link: string; title: string }[];
          versions: { link: string; version: string }[];
          changeLogs: {
            revision: string;
            version: string;
            description: string;
            date: string;
          }[];
        }
      >,
    );
  }, [details?.getProducts]);

  const groupedChangeLogs = useMemo(() => {
    const grouped: Record<string, { descriptions: string[]; date: string }> =
      {};

    productDetailsByCode[id?.toUpperCase() as string]?.changeLogs.forEach(
      (log) => {
        if (!grouped[log.version]) {
          grouped[log.version] = {
            descriptions: [],
            date: format(new Date(log.date), "PPP"),
          };
        }
        grouped[log.version].descriptions.push(log.description);
      },
    );

    return grouped;
  }, [productDetailsByCode, id]);

  return (
    <PageLayout
      hasSidebar
      pageName="Products"
      className="bg-white dark:bg-[#004580]"
      menuItems={[
        { title: "Overview", id: "top" },
        { title: "Download", id: "download" },
        { title: "Release Notes", id: "release" },
        { title: "Brochures", id: "brochure" },
      ]}
    >
      <section className="relative w-full flex flex-col min-h-screen">
        {/* HEADER */}
        <MobileNav />
        <div className="w-full xs:hidden md:flex lg:flex xl:flex 2xl:flex justify-between items-center my-3 px-3 z-10">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="dark:text-white">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="cursor-default">
                  {id?.toUpperCase()}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <ModeToggle />
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <section className="h-[30vh] p-4 gap-3 flex flex-col z-10">
            <Skeleton className="w-full h-8 rounded-lg" />
            <Skeleton className="w-3/4 h-8 rounded-lg" />
            <Skeleton className="w-1/2 h-8 rounded-lg" />
          </section>
        )}

        {/* ERROR STATE */}
        {error && <ErrorPage />}

        {details && (
          <section className="p-4 gap-3 flex flex-col z-10">
            {/* TITLE */}
            <ContentHeader
              title={`${details.getProducts[0]?.title} (${details.getProducts[0]?.code})`}
              subtitle={details.getProducts[0]?.short}
              id="top"
            />

            {/* FAQ */}
            {productDetailsByCode[id?.toUpperCase() as string]?.faqs.length >
              0 && (
              <ContentCard title="FAQ" id="faq">
                <ul>
                  {productDetailsByCode[id?.toUpperCase() as string]?.faqs.map(
                    (item, index) => (
                      <li key={index}>
                        <span className="flex gap-2 2xl:text-lg xs:text-[12px] text-[#16294a] dark:text-white">
                          <Check />
                          <strong>{item.faq}</strong>
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </ContentCard>
            )}

            {/* DOWNLOADS */}
            <ContentCard title="DOWNLOAD" id="download">
              <div className="flex items-center justify-start gap-3 flex-wrap">
                {productDetailsByCode[id?.toUpperCase() as string]?.versions
                  .length > 0 ? (
                  <DownloadVersion
                    className="dark:bg-[#004580] bg-white dark:text-white"
                    options={productDetailsByCode[
                      id?.toUpperCase() as string
                    ]?.versions.map((dl) => {
                      return { label: dl.version, value: dl.link };
                    })}
                  />
                ) : (
                  "No download available."
                )}
              </div>
            </ContentCard>

            {/* RELEASE NOTES */}
            <ContentCard
              title="RELEASE NOTES"
              id="release"
              className="2xl:max-w-[50%]"
            >
              {productDetailsByCode[id?.toUpperCase() as string]?.changeLogs
                .length > 0 ? (
                <ViewReleaseNotesTextArea
                  note={Object.entries(groupedChangeLogs)
                    .map(
                      ([version, { descriptions, date }]) =>
                        `Version: ${version} (${date})\n\n` +
                        descriptions
                          .map((desc, index) => `${index + 1} - ${desc}`)
                          .join("\n\n") +
                        "\n\n-------------------------------------------------\n\n",
                    )
                    .join("")}
                />
              ) : (
                <p className="italic text-slate-600 dark:text-slate-100 text-sm">
                  No release notes available.
                </p>
              )}
            </ContentCard>

            {/* BROCHURES */}
            <ContentCard title="BROCHURES" id="brochure">
              {productDetailsByCode[id?.toUpperCase() as string]?.downloads
                .length > 0 ? (
                <ul className="flex justify-start items-center gap-3 flex-wrap">
                  {productDetailsByCode[
                    id?.toUpperCase() as string
                  ]?.downloads.map((item, index) => (
                    <li key={index}>
                      <Link to={item.link} className="text-sm underline">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="italic text-slate-600 dark:text-slate-100 text-sm">
                  No brochures available.
                </p>
              )}
            </ContentCard>
          </section>
        )}
      </section>

      {/* OVERLAY BOTTOM */}
      <div className="w-full xs:h-[120px] sm:h-[200px] md:h-[200px] lg:h-[400px] xl:h-[400px] 2xl:h-[200px] bg-[url('/images/overlay/bottom.svg')] bg-cover bg-no-repeat bg-bottom p-0 m-0"></div>
    </PageLayout>
  );
}
