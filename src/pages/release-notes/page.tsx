import PageLayout from "@/components/custom/layout";
import ContentCard from "@/components/custom/content/content-card";
import ContentHeader from "@/components/custom/content/content-header";
import ViewReleaseNotesTextArea from "./components/modal";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import request, { gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ChangeLog, Product } from "@/types";
import { api_url } from "@/api_url";

export default function ReleaseNotes() {
  type GetAllChangeLogsData = {
    getChangeLogss: ChangeLog[];
    getProducts: Product[];
  };

  const GetAllChangeLogsDocument = gql`
    query {
      getChangeLogss {
        appName
        description
        version
        revision
        date
      }
      getProducts {
        code
        title
      }
    }
  `;

  const { data } = useQuery({
    queryKey: ["release-notes"],
    queryFn: async () =>
      request<GetAllChangeLogsData>(api_url, GetAllChangeLogsDocument),
  });

  const changeLogsByProduct = useMemo(() => {
    if (!data?.getChangeLogss) return {};
    return data.getChangeLogss.reduce(
      (map, log) => {
        if (log.appName) {
          if (!map[log.appName]) {
            map[log.appName] = {};
          }
          if (!map[log.appName][log.version]) {
            map[log.appName][log.version] = {
              descriptions: [],
              date: log.date,
            };
          }
          map[log.appName][log.version].descriptions.push(log.description);
        }
        return map;
      },
      {} as Record<
        string,
        Record<string, { descriptions: string[]; date: string }>
      >,
    );
  }, [data?.getChangeLogss]);

  const products = useMemo(() => {
    if (!data?.getProducts) return [];

    const sias = data.getProducts.find((product) => product.code === "SIAS");
    const others = data.getProducts.filter(
      (product) => product.code !== "SIAS",
    );

    return sias ? [sias, ...others] : others;
  }, [data?.getProducts]);

  return (
    <PageLayout hasNavbar>
      <section className="container mt-[1rem] flex flex-col gap-5 p-0">
        {/* TITLE */}
        <ContentHeader
          title="Release Notes"
          subtitle="List of release notes for all products"
        />

        {/* ACCORDION OF RELEASE NOTES */}
        <ContentCard className="min-h-[50vh]">
          {data && (
            <Accordion type="single" collapsible>
              {products.map((product, index: number) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{`${product.title} (${product.code})`}</AccordionTrigger>
                  <AccordionContent>
                    <ViewReleaseNotesTextArea
                      note={Object.entries(
                        changeLogsByProduct[product.code] || {},
                      )
                        .map(
                          ([version, { descriptions, date }]) =>
                            `Version: ${version} (${new Date(date).toLocaleDateString()})\n\n` +
                            descriptions
                              .map((desc, index) => `${index + 1} - ${desc}`)
                              .join("\n\n") +
                            "\n\n-------------------------------------------------\n\n",
                        )
                        .join("")}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </ContentCard>
      </section>

      {/* OVERLAY BOTTOM */}
      <div className="w-full xs:h-[120px] sm:h-[200px] md:h-[200px] lg:h-[400px] xl:h-[400px] 2xl:h-[400px] bg-[url('/images/overlay/bottom.svg')] bg-cover bg-no-repeat bg-bottom p-0 m-0"></div>
    </PageLayout>
  );
}
