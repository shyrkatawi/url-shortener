import { createRootRoute } from "@tanstack/react-router";
import { RootLayout } from "@/router/RootLayout";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

export const rootRoute = createRootRoute({
  component: RootLayout,
  pendingMs: 1,
  pendingComponent: () => (
    <div className="h-screen">
      <LoadingOverlay />
    </div>
  ),
  wrapInSuspense: true,
});
