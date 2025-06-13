import { useMutation } from "@tanstack/react-query";
import { SERVER_URL } from "@/config/config";

async function getUrlInfoRequest(alias: string): Promise<void> {
  const response = await fetch(`${SERVER_URL}/${alias}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Failed to delete URL");
  }
}

export function useDeleteUrl() {
  return useMutation({
    mutationFn: getUrlInfoRequest,
  });
}
