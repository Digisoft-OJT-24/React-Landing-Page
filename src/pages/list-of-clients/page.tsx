import PageLayout from "@/components/custom/layout";
import ContentCard from "@/components/custom/content/content-card";
import ContentHeader from "@/components/custom/content/content-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { request, gql } from "graphql-request";
import { Province, School } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { api_url } from "@/api_url";

export default function ListOfClients() {
  type ListOfClientsData = {
    getProvinces: Province[];
    getSchools: School[];
  };
  const listOfClientQueryDocument = gql`
    query {
      getProvinces {
        id
        name
      }
      getSchools {
        name
        provinceId
      }
    }
  `;

  const { data, isLoading, error } = useQuery({
    queryKey: ["list-of-clients"],
    queryFn: async () =>
      request<ListOfClientsData>(
        api_url,
        listOfClientQueryDocument,
      ),
  });

  const schoolsByProvince = useMemo(() => {
    if (!data?.getSchools) return {};
    return data.getSchools.reduce(
      (map, school) => {
        if (school && school.provinceId) {
          if (!map[school.provinceId]) {
            map[school.provinceId] = [];
          }
          map[school.provinceId].push(school);
        }
        return map;
      },
      {} as Record<string, School[]>,
    );
  }, [data?.getSchools]);

  return (
    <PageLayout hasNavbar pageName="Clients">
      <section className="min-h-[70vh] container py-[1rem] flex flex-col gap-5 p-0">
        {/* TITLE */}
        <ContentHeader
          title="List of Clients"
          subtitle="List of clients who have purchased / subscribed to the products."
        />

        {/* LOADING INDICATOR */}
        {isLoading ? (
          <div className="flex flex-col items-start justify-center">
            <Skeleton className="w-full h-8 mb-4 rounded-md" />
            <Skeleton className="w-3/4 h-8 mb-4 rounded-md" />
            <Skeleton className="w-1/2 h-8 mb-4 rounded-md" />
          </div>
        ) : (
          <>
            {data && (
              <ContentCard id="list-of-clients">
                <Accordion type="multiple" className="w-full">
                  {data.getProvinces.map((province, index: number) => (
                    <AccordionItem key={index} value={province.id}>
                      <AccordionTrigger>{province.name}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5">
                          {(schoolsByProvince[province.id] || []).map(
                            (school: School, index: number) => (
                              <li key={index}>{school.name}</li>
                            ),
                          )}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ContentCard>
            )}
            {error && (
              <div className="text-red-500">
                Error fetching data:{" "}
                {error instanceof Error ? error.message : "Unknown error"}
              </div>
            )}
          </>
        )}
      </section>

      {/* OVERLAY BOTTOM */}
      <div className="w-full xs:h-[120px] sm:h-[200px] md:h-[200px] lg:h-[400px] xl:h-[400px] 2xl:h-[400px] bg-[url('/images/overlay/bottom.svg')] bg-cover bg-no-repeat bg-bottom p-0 m-0"></div>
    </PageLayout>
  );
}
