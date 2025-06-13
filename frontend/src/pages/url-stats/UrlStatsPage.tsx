import { useState } from "react";
import { createLazyRoute } from "@tanstack/react-router";
import { useGetUrlAnalytics } from "@/pages/url-stats/useGetUrlAnalytics";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useGetUrlInfo } from "@/pages/url-stats/useGetUrlInfo";
import { Input } from "@/components/ui/Input";

export const UrlStatsPage = () => {
  const [alias, setAlias] = useState<string>("");

  const {
    data: urlInfo,
    error: urlInfoError,
    isPending: isUrlInfoPending,
    mutate: getUrlInfo,
  } = useGetUrlInfo();

  const [lastAnalyticsAlias, setLastAnalyticsAlias] = useState<string>("");

  const handleGetInfo = () => {
    getUrlInfo(alias);
    setLastInfoAlias(alias);
  };

  const {
    data: urlAnalytics,
    error: urlAnalyticsError,
    isPending: isUrlAnalyticsPending,
    mutate: getUrlAnalytics,
  } = useGetUrlAnalytics();

  const [lastInfoAlias, setLastInfoAlias] = useState<string>("");

  const handleGetAnalytics = () => {
    getUrlAnalytics(alias);
    setLastAnalyticsAlias(alias);
  };

  return (
    <div className="mx-auto mt-10 max-w-xl p-4">
      <h1 className="mb-4 text-center text-2xl font-bold">URL Statistics</h1>
      <Card className="relative mx-auto mt-6 max-w-md">
        <CardContent>
          <Input
            type="text"
            placeholder="Enter alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card className="relative mx-auto mt-6 max-w-md">
        {isUrlInfoPending && <LoadingOverlay />}
        <CardContent className="space-y-4 p-6">
          <Button disabled={isUrlInfoPending} className="w-full" onClick={handleGetInfo}>
            Get info
          </Button>

          {urlInfoError && (
            <div className="text-center">
              <p>Alias: {lastInfoAlias}</p>
              <p className="text-red-600">Error: {urlInfoError.message}</p>
            </div>
          )}

          {urlInfo && (
            <div className="space-y-2">
              <h1 className="text-center text-xl font-bold">URL Info</h1>
              <p>Alias: {lastInfoAlias}</p>
              <p>Click Count: {urlInfo.clickCount}</p>
              <p className="break-all">Original Url: {urlInfo.originalUrl}</p>
              <p>Created at: {new Date(urlInfo.createdAt).toLocaleDateString()}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="relative mx-auto mt-6 max-w-md">
        {isUrlAnalyticsPending && <LoadingOverlay />}
        <CardContent className="space-y-4 p-6">
          <Button disabled={isUrlAnalyticsPending} className="w-full" onClick={handleGetAnalytics}>
            Get analytics
          </Button>

          {urlAnalyticsError && (
            <div className="text-center">
              <p>Alias: {lastAnalyticsAlias}</p>
              <p className="text-red-600">Error: {urlAnalyticsError.message}</p>
            </div>
          )}

          {urlAnalytics && (
            <div className="space-y-2">
              <h1 className="text-center text-xl font-bold">URL Analytics</h1>
              <p>Alias: {lastAnalyticsAlias}</p>
              <p>Click Count: {urlAnalytics.clickCount}</p>
              <div>
                <p>Last visited IP Addresses:</p>
                <ul className="text-sm text-gray-700">
                  {urlAnalytics.ips.map((ip, index) => (
                    // yes, I use index as key here, because
                    // 1. multiple IPs can be the same
                    // 2. IPs are not expected to change frequently
                    <li key={index}>{ip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const Route = createLazyRoute("/url-stats")({
  component: UrlStatsPage,
});
