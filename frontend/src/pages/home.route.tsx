import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/router/root.route";

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
}).lazy(() => import("./home/HomePage.tsx").then(({ Route }) => Route));
