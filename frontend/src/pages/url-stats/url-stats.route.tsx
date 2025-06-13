import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/router/root.route";

export const urlStatsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "url-stats",
}).lazy(() => import("./UrlStatsPage.tsx").then(({ Route }) => Route));
