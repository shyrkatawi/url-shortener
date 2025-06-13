import { createLazyRoute } from "@tanstack/react-router";
import { UrlShortenerForm } from "@/pages/home/url-shortener-form/UrlShortenerForm";
import type { TUrlShortenerForm } from "@/pages/home/url-shortener-form/UrlShortenerForm.type";
import { Card, CardContent } from "@/components/ui/Card";
import { type CreateShortUrlBody, useCreateShortUrl } from "@/pages/home/useCreateShortUrl";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

const prepareUrlShortenerForm = (data: TUrlShortenerForm): CreateShortUrlBody => {
  return {
    url: data.url,
    alias: data.alias?.length ? data.alias : undefined,
    expiresAt: data.expiresAt ? data.expiresAt.toISOString() : undefined,
  };
};

export const HomePage = () => {
  const { data, error, isPending, mutate: createShortUrl } = useCreateShortUrl();

  const shortUrl: string | undefined = data?.shortUrl;

  const onSubmit = (data: TUrlShortenerForm) => {
    createShortUrl(prepareUrlShortenerForm(data));
  };

  return (
    <div className="mx-auto mt-10 max-w-xl p-4">
      {isPending && <LoadingOverlay />}
      <h1 className="mb-4 text-center text-2xl font-bold">Shorten your URL</h1>
      <Card className="mx-auto mt-10 max-w-md">
        <CardContent className="p-6">
          <UrlShortenerForm onSubmit={onSubmit} />
          {error && (
            <div className="mt-4 text-center text-red-600">
              <p>Error: {error.message}</p>
            </div>
          )}
          {shortUrl && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">Your shortened URL:</p>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-blue-600 underline"
              >
                {shortUrl}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const Route = createLazyRoute("/")({
  component: HomePage,
});
