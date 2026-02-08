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
      request<GetAllChangeLogsData>(
        import.meta.env.VITE_API_URL,
        GetAllChangeLogsDocument,
      ),
  });

  const changeLogsByProduct = useMemo(() => {
    if (!data?.getChangeLogss) return {};
    return data.getChangeLogss.reduce(
      (map, log) => {
        if (log.appName) {
          if (!map[log.appName]) {
            map[log.appName] = [];
          }
          map[log.appName].push(log);
        }
        return map;
      },
      {} as Record<string, ChangeLog[]>,
    );
  }, [data?.getChangeLogss]);

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
              {data.getProducts.map((product, index: number) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{`${product.title} (${product.code})`}</AccordionTrigger>
                  <AccordionContent>
                    <ViewReleaseNotesTextArea
                      note={(changeLogsByProduct[product.code] || [])
                        .map(
                          (log) =>
                            `Version: ${log.version}\nRevision: ${log.revision}\n\n${log.description}\n\n----------------------\n`,
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
