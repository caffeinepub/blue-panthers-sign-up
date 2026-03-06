import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import AdminPage from "./pages/AdminPage";
import OwnerDashboard from "./pages/OwnerDashboard";
import SignUpPage from "./pages/SignUpPage";
import SignUpsPage from "./pages/SignUpsPage";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Layout>
      <SignUpPage />
    </Layout>
  ),
});

const signUpsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signups",
  component: SignUpsPage,
});

const ownerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/owner",
  component: OwnerDashboard,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  signUpsRoute,
  ownerRoute,
  adminRoute,
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
