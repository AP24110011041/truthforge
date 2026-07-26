import { NavLink } from "react-router-dom";

import { cn } from "@/utils/cn";
import { navigationItems } from "@/utils/navigation";

type AppNavProps = {
  variant?: "sidebar" | "mobile";
};

export function AppNav({ variant = "sidebar" }: AppNavProps) {
  const isSidebar = variant === "sidebar";

  return (
    <nav
      className={cn(
        isSidebar ? "grid gap-1" : "flex gap-1 overflow-x-auto border-b bg-background px-3 py-2"
      )}
      aria-label="Primary navigation"
    >
      {navigationItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/"}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isSidebar
                ? "text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                : "min-w-fit text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              isActive &&
                (isSidebar
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "bg-accent text-accent-foreground")
            )
          }
        >
          <item.icon className="size-4" aria-hidden="true" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
