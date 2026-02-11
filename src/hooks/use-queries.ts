import { api_url } from "@/api_url";
import { GetAllProductsData } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";

export function GetAllProductsQuery() {
  const getAllProductsQueryDocument = gql`
    query {
      getProducts () {
        code
        description
        short
        title
      }
    }
  `;

  const { data, isLoading, error } = useQuery({
    queryKey: ["all-products"],
    queryFn: async () =>
      request<GetAllProductsData>(
        api_url,
        getAllProductsQueryDocument,
      ),
  });

  return { data, isLoading, error };
}
