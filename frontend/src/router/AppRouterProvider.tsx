import { rootRoute } from "@/router/root.route";
import { urlStatsRoute } from "@/pages/url-stats/url-stats.route";
import { homeRoute } from "@/pages/home.route";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { deleteUrlRoute } from "@/pages/delete-url/delete-url.route";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const routeTree = rootRoute.addChildren([
  //
  deleteUrlRoute,
  homeRoute,
  urlStatsRoute,
]);

const router = createRouter({
  routeTree,
  context: undefined!, // This will be set after we wrap the app in an AuthProvider
});

export const AppRouterProvider = () => {
  return <RouterProvider router={router} />;
};
