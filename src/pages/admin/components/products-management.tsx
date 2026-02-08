import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAtomValue } from "jotai";
import { selectedSecondaryItemAtom } from "@/atom-store";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { DataTable } from "@/components/custom/data-table/table";
import { versionColumns } from "./table-columns/version-columns";
import { ChangeLog, ProductBrochure, ProductVersion } from "@/types";
import { changelogsColumns } from "./table-columns/changelogs-columns";
import { brochureColumns } from "./table-columns/brochure-columns";
import { Textarea } from "@/components/ui/textarea";

type GetAllProductsData = {
  getProducts: {
    code: string;
    title: string;
    short: string;
    description: string;
    versions: ProductVersion[];
    changeLogs: ChangeLog[];
    downloads: ProductBrochure[];
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
  const [formData, setFormData] = useState({
    title: "",
    short: "",
    description: "",
  });
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
      setFormData({ title: "", short: "", description: "" });
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

  // Update form data when selected product changes
  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        title: selectedProduct.title || "",
        short: selectedProduct.short || "",
        description: selectedProduct.description || "",
      });
    } else {
      setFormData({ title: "", short: "", description: "" });
    }
  }, [selectedProduct]);

  return (
    <>
      <div className="space-y-3 p-2">
        {selectedProduct && (
          <>
            <span className="text-xl font-bold w-full flex flex-row items-center gap-2">
              Product <ChevronRight className="w-4 h-4" />{" "}
              {selectedProduct.code.toUpperCase()}
            </span>
            <form className="flex justify-between items-start gap-2">
              <div className="w-3/4">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <Label>Short</Label>
                <Input
                  value={formData.short}
                  onChange={(e) =>
                    setFormData({ ...formData, short: e.target.value })
                  }
                />
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="w-1/4 flex flex-col gap-2 p-6">
                <Button type="submit" variant={"outline"}>
                  Edit
                </Button>
                <Button type="button" variant={"destructive"}>
                  Mark as Inactive
                </Button>
              </div>
            </form>
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
              </TabsList>
              <TabsContent value="versions">
                <DataTable
                  columns={versionColumns}
                  data={selectedProduct?.versions || []}
                  rightActions={<Button variant={"outline"}>Add</Button>}
                />
              </TabsContent>
              <TabsContent value="revisions">
                <DataTable
                  columns={changelogsColumns}
                  data={selectedProduct?.changeLogs || []}
                  rightActions={<Button variant={"outline"}>Add</Button>}
                />
              </TabsContent>
              <TabsContent value="brochure">
                <DataTable
                  columns={brochureColumns}
                  data={selectedProduct?.downloads || []}
                  rightActions={<Button variant={"outline"}>Add</Button>}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </>
  );
}
