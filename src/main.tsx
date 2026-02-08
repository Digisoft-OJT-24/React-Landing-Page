import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider";
const HomePage = lazy(() => import("./pages/home/page"));
const ProductPreview = lazy(() => import("./pages/preview/page"));
const ListOfClients = lazy(() => import("./pages/list-of-clients/page"));
const ReleaseNotes = lazy(() => import("./pages/release-notes/page"));
import LoginPage from "./pages/login/page";
import "./index.css";
import AdminPage from "./pages/admin/page";
import { Toaster } from "./components/ui/sonner";

const queryClient = new QueryClient();

const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/ds-login",
    element: <LoginPage />,
  },
  {
    path: "/ds-dashboard",
    element: <AdminPage />,
  },
  {
    path: "/list-of-clients",
    element: <ListOfClients />,
  },
  {
    path: "/release-notes",
    element: <ReleaseNotes />,
  },
  {
    path: "/products/:id",
    element: <ProductPreview />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={routes} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
