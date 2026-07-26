import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { fadeInUp } from "@/lib/motion";

type AgentCardProps = {
  name: string;
  role: string;
  status: string;
  icon: LucideIcon;
  load: number;
};

export function AgentCard({ name, role, status, icon: Icon, load }: AgentCardProps) {
  return (
    <motion.article
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-white/10 bg-slate-950/50 p-5 shadow-xl shadow-black/20 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-violet-500/24 to-blue-500/16 text-blue-100 ring-1 ring-white/10">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <Badge className="border-white/10 bg-white/[0.06] text-slate-200" variant="outline">
          {status}
        </Badge>
      </div>
      <div className="mt-5 space-y-2">
        <h3 className="text-base font-semibold text-white">{name}</h3>
        <p className="min-h-10 text-sm leading-5 text-slate-400">{role}</p>
      </div>
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>Readiness</span>
          <span>{load}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-300"
            style={{ width: `${load}%` }}
          />
        </div>
      </div>
    </motion.article>
  );
}
