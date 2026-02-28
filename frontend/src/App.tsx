import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import SignUpPage from './pages/SignUpPage';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminPage from './pages/AdminPage';
import SignUpsPage from './pages/SignUpsPage';
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

const signUpsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/signups',
    component: SignUpsPage,
});

const ownerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/owner',
    component: OwnerDashboard,
});

const adminRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
    component: AdminPage,
});

const routeTree = rootRoute.addChildren([indexRoute, signUpsRoute, ownerRoute, adminRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

export default function App() {
    return <RouterProvider router={router} />;
}
