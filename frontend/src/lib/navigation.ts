import { Bot, FileText, Image, LayoutDashboard, SearchCheck, Settings2, ShieldQuestion } from "lucide-react";

export const mainNavigation = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard
  },
  {
    label: "Research Workspace",
    path: "/research",
    icon: SearchCheck
  },
  {
    label: "Fact Check",
    path: "/fact-check",
    icon: ShieldQuestion
  },
  // CIFAKE entry removed for TIGAS‑only release
  {
    label: "TIGAS Classifier",
    path: "/tigas",
    icon: Image
  },
  {
    label: "Agents",
    path: "/agents",
    icon: Bot
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
] as const;
