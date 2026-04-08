import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import { LanguageProvider } from "./contexts/LanguageContext";
import CalendarPage from "./pages/CalendarPage";
import HomePage from "./pages/HomePage";
import PropertyPage from "./pages/PropertyPage";
import ReviewsPage from "./pages/ReviewsPage";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <ScrollToTop />
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const waldhausRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/domizile/waldhaus-tannenhof",
  component: () => <PropertyPage propertyId="waldhaus" />,
});

const forsthausRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/domizile/forsthaus-hirschgrund",
  component: () => <PropertyPage propertyId="forsthaus" />,
});

const fichtenbergRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/domizile/fichtenberg",
  component: () => <PropertyPage propertyId="fichtenberg" />,
});

const schwarzwaldblickRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/domizile/schwarzwaldblick",
  component: () => <PropertyPage propertyId="schwarzwaldblick" />,
});

const reviewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bewertungen",
  component: ReviewsPage,
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verfuegbarkeit",
  component: CalendarPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  waldhausRoute,
  forsthausRoute,
  fichtenbergRoute,
  schwarzwaldblickRoute,
  reviewsRoute,
  calendarRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
    >
      <LanguageProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" />
      </LanguageProvider>
    </ThemeProvider>
  );
}
