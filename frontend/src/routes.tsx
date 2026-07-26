import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/layouts/AppLayout";
import { AgentsPage } from "@/pages/AgentsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { FactCheckPage } from "@/pages/FactCheckPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ReportsPage } from "@/pages/ReportsPage";
import ResearchPage from "@/pages/ResearchPage";
import { SettingsPage } from "@/pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: "dashboard",
        element: <DashboardPage />
      },
      {
        path: "research",
        element: <ResearchPage />
      },
      {
        path: "fact-check",
        element: <FactCheckPage />
      },
      {
        path: "agents",
        element: <AgentsPage />
      },
      {
        path: "reports",
        element: <ReportsPage />
      },
      {
        path: "settings",
        element: <SettingsPage />
      },
      {
        path: "*",
        element: <NotFoundPage />
      }
    ]
  }
]);
