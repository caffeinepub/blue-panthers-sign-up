import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import SignUpPage from './pages/SignUpPage';
import OwnerDashboard from './pages/OwnerDashboard';
import Layout from './components/Layout';

const rootRoute = createRootRoute({
    component: () => <Outlet />,
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => (
        <Layout>
            <SignUpPage />
        </Layout>
    ),
});

const ownerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/owner',
    component: OwnerDashboard,
});

const routeTree = rootRoute.addChildren([indexRoute, ownerRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

export default function App() {
    return <RouterProvider router={router} />;
}
