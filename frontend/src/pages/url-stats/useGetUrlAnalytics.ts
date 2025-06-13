import { useMutation } from "@tanstack/react-query";
import { SERVER_URL } from "@/config/config";

export type GetAnalyticsResponse = {
  clickCount: number;
  ips: string[];
};

async function getUrlAnalyticsRequest(alias: string): Promise<GetAnalyticsResponse> {
  const response = await fetch(`${SERVER_URL}/analytics/${alias}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseBody = await response.json();

  if (response.ok) {
    return responseBody;
  }

  throw new Error(responseBody.message || "Failed to get analytics");
}

export function useGetUrlAnalytics() {
  return useMutation({
    mutationFn: getUrlAnalyticsRequest,
  });
}
