import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { fadeInUp } from "@/lib/motion";
import { cn } from "@/utils/cn";

type StatTone = "violet" | "blue" | "cyan" | "amber";

type StatCardProps = {
  label: string;
  value: string;
  trend: string;
  description: string;
  icon: LucideIcon;
  tone: StatTone;
};

const toneClassNames: Record<StatTone, string> = {
  violet: "from-violet-500/24 to-fuchsia-500/10 text-violet-200 ring-violet-400/25",
  blue: "from-blue-500/24 to-cyan-400/10 text-blue-200 ring-blue-400/25",
  cyan: "from-cyan-400/22 to-emerald-400/10 text-cyan-100 ring-cyan-300/25",
  amber: "from-amber-400/22 to-orange-500/10 text-amber-100 ring-amber-300/25"
};

export function StatCard({ label, value, trend, description, icon: Icon, tone }: StatCardProps) {
  return (
    <motion.article
      variants={fadeInUp}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-normal text-white">{value}</p>
        </div>
        <div className={cn("grid size-11 place-items-center rounded-xl bg-gradient-to-br ring-1", toneClassNames[tone])}>
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-200">
          {trend}
        </span>
        <p className="min-w-0 truncate text-xs text-slate-500">{description}</p>
      </div>
    </motion.article>
  );
}
