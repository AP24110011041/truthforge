import { Bell, Moon, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";

import { SearchBar } from "@/components/common/SearchBar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { mainNavigation } from "@/lib/navigation";
import { cn } from "@/utils/cn";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
      <div className="flex min-h-20 items-center gap-3 px-4 sm:px-6 xl:px-8">
        <div className="hidden min-w-0 flex-1 md:block">
          <SearchBar className="max-w-2xl" />
        </div>
        <div className="flex flex-1 items-center gap-3 md:flex-none">
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 border-white/10 bg-white/[0.06] text-slate-300 hover:bg-white/[0.1] hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="size-4" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 border-white/10 bg-white/[0.06] text-slate-300 hover:bg-white/[0.1] hover:text-white"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? <Moon className="size-4" aria-hidden="true" /> : <Sun className="size-4" aria-hidden="true" />}
          </Button>
          <div className="flex min-w-0 items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] py-1 pl-1 pr-3">
            <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-blue-400 text-sm font-semibold text-white">
              TF
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-medium text-white">Alex Morgan</p>
              <p className="truncate text-xs text-slate-500">Research Lead</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-3 py-2 md:hidden">
        <SearchBar />
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-white/10 px-3 py-2 lg:hidden" aria-label="Mobile navigation">
        {mainNavigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "flex min-w-fit items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-white/[0.07] hover:text-white",
                isActive && "bg-white/[0.09] text-white"
              )
            }
          >
            <item.icon className="size-4" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
