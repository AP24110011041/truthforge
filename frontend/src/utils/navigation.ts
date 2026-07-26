import { FileText, LayoutDashboard, SearchCheck, Settings2 } from "lucide-react";

import type { NavigationItem } from "@/types/navigation";

export const navigationItems: NavigationItem[] = [
  {
    label: "Overview",
    path: "/",
    icon: LayoutDashboard
  },
  {
    label: "Research",
    path: "/research",
    icon: SearchCheck
  },
  {
    label: "Reports",
    path: "/reports",
    icon: FileText
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings2
  }
];
