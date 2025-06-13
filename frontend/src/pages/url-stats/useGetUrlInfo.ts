import { useMutation } from "@tanstack/react-query";
import { SERVER_URL } from "@/config/config";

export type GetAnalyticsResponse = {
  clickCount: number;
  createdAt: Date;
  originalUrl: string;
};

async function getUrlInfoRequest(alias: string): Promise<GetAnalyticsResponse> {
  const response = await fetch(`${SERVER_URL}/info/${alias}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseBody = await response.json();

  if (response.ok) {
    return responseBody;
  }

  throw new Error(responseBody.message || "Failed to get info");
}

export function useGetUrlInfo() {
  return useMutation({
    mutationFn: getUrlInfoRequest,
  });
}
