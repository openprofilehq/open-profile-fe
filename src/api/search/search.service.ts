import { callApi } from "@/api/base";

export type SearchResult = {
  results: any[];
  total: number;
};

export async function searchProfiles(query: string) {
  const response = await callApi<SearchResult>({
    url: "/search",
    method: "GET",
    params: { q: query },
  });

  return response;
}
