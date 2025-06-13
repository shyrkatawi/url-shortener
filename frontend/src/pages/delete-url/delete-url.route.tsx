import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/router/root.route";

export const deleteUrlRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "delete-url",
}).lazy(() => import("./DeleteUrlPage.tsx").then(({ Route }) => Route));
