import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Dashboard from "./pages/Dashboard";
import KitCreator from "./pages/KitCreator";
import RecipientLanding from "./pages/RecipientLanding";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

const createKitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/create/$id",
  component: KitCreator,
});

const recipientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/s/$token",
  component: RecipientLanding,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  createKitRoute,
  recipientRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
