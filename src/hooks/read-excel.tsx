import { useEffect, useState, useMemo } from "react";
import * as XLSX from "xlsx";

// Types
export interface ParsedFile {
  fileName: string;
  sheets: {
    [sheetName: string]: Record<string, unknown>[];
  };
}

// Generic hook to read any Excel file
export function useReadExcel(filePath: string) {
  const [data, setData] = useState<ParsedFile | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const fileResponse = await fetch(filePath);
        const arrayBuffer = await fileResponse.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const sheetsData: ParsedFile["sheets"] = {};
        for (const sheetName of workbook.SheetNames) {
          const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
            workbook.Sheets[sheetName],
            { defval: "" } // Fill blanks with empty string to simplify filtering
          );

          // Filter out rows where all values are empty
          const filteredRows = rawRows.filter((row) =>
            Object.values(row).some((val) => val !== null && val !== "")
          );

          sheetsData[sheetName] = filteredRows;
        }

        if (!cancelled) {
          setData({
            fileName: filePath.split("/").pop() || "",
            sheets: sheetsData,
          });
        }
      } catch (err) {
        console.error("Failed to read Excel:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [filePath]);

  return data;
}

// Specific hook to read products file
export function UseProductsData() {
  return useReadExcel("/data/products.xlsx");
}

// Clients list reader
export function GetListOfClients() {
  const data = useReadExcel("/data/list-of-clients.xlsx");
  return useMemo(() => data?.sheets?.ListOfClients ?? [], [data]);
}

// Get all product previews
export function GetAllProducts() {
  const dbProduct = UseProductsData();

  return useMemo(() => {
    if (!dbProduct?.sheets?.Info) return [];

    const { Info, FAQ = [], Download = [], Brochure = [] } = dbProduct.sheets;

    return Info.map((info) => ({
      code: info.Code,
      title: `${info.Title} (${info.Code})`,
      description: info.Description,
      href: `/products/${info.Code}`.toLowerCase(),
      faq: FAQ.filter((faq) => faq.Code === info.Code)
        .slice(0, 1)
        .map((f) => f.FAQ),
      download: Download.find((dl) => dl.Code === info.Code)?.Link || null,
      brochure: Brochure.find((br) => br.Code === info.Code)?.Link || null,
      short_des: info.Short,
    }));
  }, [dbProduct]);
}

// Get full product details
export function GetProductDetails(code: string) {
  const dbProduct = UseProductsData();

  return useMemo(() => {
    if (!dbProduct?.sheets?.Info) return null;

    const { Info, FAQ = [], Download = [], Brochure = [] } = dbProduct.sheets;
    const info = Info.find((p) => p.Code === code.toUpperCase());
    if (!info) return null;

    return {
      title: `${info.Title} (${info.Code})`,
      description: info.Short,
      href: `/products/${info.Code}`,
      faq: FAQ.filter((faq) => faq.Code === code.toUpperCase()).map(
        (f) => f.FAQ
      ),
      download: Download.filter((dl) => dl.Code === code.toUpperCase()).map(
        (dl) => ({
          version: dl.Version,
          link: dl.Link,
        })
      ),
      brochure: Brochure.filter((br) => br.Code === code.toUpperCase()).map(
        (br) => ({
          title: br.Title,
          link: br.Link,
        })
      ),
    };
  }, [dbProduct, code]);
}
