import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import OpportunityDetailsPage from '@/components/pages/OpportunityDetailsPage';
import ProfilePage from '@/components/pages/ProfilePage';
import ApplicationsPage from '@/components/pages/ApplicationsPage';
import FeedbackPage from '@/components/pages/FeedbackPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "opportunity/:id",
        element: <OpportunityDetailsPage />,
        routeMetadata: {
          pageIdentifier: 'opportunity-details',
        },
      },
      {
        path: "profile",
        element: <ProfilePage />,
        routeMetadata: {
          pageIdentifier: 'profile',
        },
      },
      {
        path: "applications",
        element: <ApplicationsPage />,
        routeMetadata: {
          pageIdentifier: 'applications',
        },
      },
      {
        path: "feedback",
        element: <FeedbackPage />,
        routeMetadata: {
          pageIdentifier: 'feedback',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
