import { useMutation } from "@tanstack/react-query";
import { SERVER_URL } from "@/config/config";

export type CreateShortUrlBody = {
  url: string;
  alias?: string;
  expiresAt?: string;
};

export type CreateShortUrlResponse = {
  shortUrl: string;
};

async function createShortUrlRequest(body: CreateShortUrlBody): Promise<CreateShortUrlResponse> {
  const response = await fetch(`${SERVER_URL}/shorten`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const responseBody = await response.json();

  if (response.ok) {
    return responseBody;
  }

  throw new Error(responseBody.message || "Failed to create short URL");
}

export function useCreateShortUrl() {
  return useMutation({
    mutationFn: createShortUrlRequest,
  });
}
