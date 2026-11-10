import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/layouts/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import ResearchPage from "@/pages/ResearchPage";
import { FactCheckPage } from "@/pages/FactCheckPage";
import { AgentsPage } from "@/pages/AgentsPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { SettingsPage } from "@/pages/SettingsPage";

import TigasPredictPage from "@/pages/TigasPredictPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // layout wrapper
    errorElement: <NotFoundPage />, // fallback for unknown routes
    children: [
      // Home page – Dashboard
      { index: true, element: <DashboardPage /> },
      // Explicit dashboard route
      { path: "dashboard", element: <DashboardPage /> },
      // Veritas‑AI core pages
      { path: "research", element: <ResearchPage /> },
      { path: "fact-check", element: <FactCheckPage /> },
      { path: "agents", element: <AgentsPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "settings", element: <SettingsPage /> },
      // New routes
      { path: "tigas", element: <TigasPredictPage /> },
      // Wildcard fallback inside children
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
