import { motion } from "framer-motion";
import { Flame, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { mainNavigation } from "@/lib/navigation";
import { cn } from "@/utils/cn";

export function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -32, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.34, ease: "easeOut" }}
      className="hidden min-h-screen w-72 shrink-0 border-r border-white/10 bg-slate-950/72 px-4 py-5 shadow-2xl shadow-black/30 backdrop-blur-2xl lg:flex lg:flex-col"
    >
      <div className="flex items-center gap-3 px-2">
        <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/20">
          <Flame className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-white">TruthForge AI</p>
          <p className="truncate text-xs text-slate-400">Forge Truth. Verify Every Claim.</p>
        </div>
      </div>

      <div className="mt-8 px-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Menu</p>
      </div>

      <nav className="mt-3 grid gap-1" aria-label="Main navigation">
        {mainNavigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-white/[0.07] hover:text-white",
                isActive && "bg-white/[0.09] text-white shadow-lg shadow-blue-950/25"
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-400 to-blue-400 opacity-0 transition-opacity",
                    isActive && "opacity-100"
                  )}
                />
                <item.icon
                  className={cn("size-4 text-slate-500 transition-colors group-hover:text-blue-200", isActive && "text-blue-200")}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/16 via-blue-500/10 to-white/[0.03] p-4 shadow-xl shadow-black/20">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles className="size-4 text-blue-200" aria-hidden="true" />
            Verification Core
          </div>
          <Badge className="border-blue-300/20 bg-blue-400/10 text-blue-100" variant="outline">
            Ready
          </Badge>
        </div>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="flex justify-between gap-3">
            <span>Claim scoring</span>
            <span className="text-slate-200">Reserved</span>
          </div>
          <div className="flex justify-between gap-3">
            <span>Citation graph</span>
            <span className="text-slate-200">Staged</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
