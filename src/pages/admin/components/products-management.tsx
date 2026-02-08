import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAtomValue } from "jotai";
import { selectedSecondaryItemAtom } from "@/atom-store";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { DataTable } from "@/components/custom/data-table/table";
import { versionColumns } from "./table-columns/version-columns";
import { ChangeLog, ProductBrochure, ProductVersion } from "@/types";
import { changelogsColumns } from "./table-columns/changelogs-columns";
import { brochureColumns } from "./table-columns/brochure-columns";
import ProductForm from "./forms/product_form";
import { faqColumns } from "./table-columns/faq-columns";

type GetAllProductsData = {
  getProducts: {
    code: string;
    title: string;
    short: string;
    description: string;
    versions: ProductVersion[];
    changeLogs: ChangeLog[];
    downloads: ProductBrochure[];
    faqs: { faq: string }[];
  }[];
};

type ProductsManagementProps = {
  setNavItems: (items: { title: string; id: string }[]) => void;
};

export default function ProductsManagement({
  setNavItems,
}: ProductsManagementProps) {
  const [selectedProduct, setSelectedProduct] = useState<
    GetAllProductsData["getProducts"][0] | null
  >(null);
  const selectedSecondaryItem = useAtomValue(selectedSecondaryItemAtom);

  // Fetch products
  const getAllProductsQuery = gql`
    query {
      getProducts {
        code
        title
        short
        description
        versions {
          id
          link
          productCode
          version
        }
        changeLogs {
          date
          description
          revision
          version
        }
        downloads {
          link
          title
        }
        faqs {
          faq
        }
      }
    }
  `;

  const { data } = useQuery<GetAllProductsData>({
    queryKey: ["admin-products"],
    queryFn: async () =>
      request(import.meta.env.VITE_API_URL, getAllProductsQuery),
  });

  // Create hashmap for O(1) product lookup by code
  const productsMap = useMemo(() => {
    const map = new Map<string, GetAllProductsData["getProducts"][0]>();
    if (data?.getProducts) {
      data.getProducts.forEach((product) => {
        map.set(product.code.toLowerCase(), product);
      });
    }
    return map;
  }, [data?.getProducts]);

  // Set nav items
  useEffect(() => {
    if (data?.getProducts) {
      setNavItems([
        ...data.getProducts.map((product) => ({
          title: product.code.toUpperCase(),
          id: product.code.toLowerCase(),
        })),
      ]);
    }
  }, [data, setNavItems]);

  // Set selected product: use selectedSecondaryItem if available, otherwise default to first product
  useEffect(() => {
    if (!data?.getProducts || productsMap.size === 0) {
      setSelectedProduct(null);
      return;
    }

    if (selectedSecondaryItem && productsMap.has(selectedSecondaryItem)) {
      // Use hashmap for O(1) lookup of selected product
      const product = productsMap.get(selectedSecondaryItem)!;
      setSelectedProduct(product);
    } else if (data.getProducts.length > 0) {
      // Default to first product if no selection
      setSelectedProduct(data.getProducts[0]);
    }
  }, [selectedSecondaryItem, productsMap, data]);

  return (
    <div className="space-y-3 p-2">
        {selectedProduct && (
          <>
            <span className="text-xl font-bold w-full flex flex-row items-center gap-2">
              Product <ChevronRight className="w-4 h-4" />{" "}
              {selectedProduct.code.toUpperCase()}
            </span>
            <ProductForm data={selectedProduct} className="max-w-[50%]" />
            <Separator className="my-2" />
            <Tabs defaultValue="versions">
              <TabsList className="w-full justify-around border-b rounded-none">
                <TabsTrigger value="versions" className="w-full">
                  Versions
                </TabsTrigger>
                <TabsTrigger value="revisions" className="w-full">
                  Revisions
                </TabsTrigger>
                <TabsTrigger value="brochure" className="w-full">
                  Brochures
                </TabsTrigger>
                <TabsTrigger value="faq" className="w-full">
                  FAQs
                </TabsTrigger>
              </TabsList>
              <TabsContent value="versions">
                <DataTable
                  columns={versionColumns}
                  data={selectedProduct.versions || []}
                  rightActions={<Button variant={"outline"}>Add</Button>}
                />
              </TabsContent>
              <TabsContent value="revisions">
                <DataTable
                  columns={changelogsColumns}
                  data={selectedProduct.changeLogs || []}
                  rightActions={<Button variant={"outline"}>Add</Button>}
                />
              </TabsContent>
              <TabsContent value="brochure">
                <DataTable
                  columns={brochureColumns}
                  data={selectedProduct.downloads || []}
                  rightActions={<Button variant={"outline"}>Add</Button>}
                />
              </TabsContent>
              <TabsContent value="faq">
                <DataTable
                  columns={faqColumns}
                  data={selectedProduct.faqs || []}
                  rightActions={<Button variant={"outline"}>Add</Button>}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
  );
}
