import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { fadeInUp } from "@/lib/motion";

type ActivityItemProps = {
  title: string;
  description: string;
  timestamp: string;
  status: string;
};

export function ActivityItem({ title, description, timestamp, status }: ActivityItemProps) {
  return (
    <motion.li variants={fadeInUp} className="relative flex gap-4 pb-6 last:pb-0">
      <div className="absolute bottom-0 left-[17px] top-9 w-px bg-white/10 last:hidden" />
      <div className="relative z-10 grid size-9 shrink-0 place-items-center rounded-full border border-blue-300/25 bg-blue-400/10 text-blue-200">
        <CheckCircle2 className="size-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
          </div>
          <Badge className="w-fit border-white/10 bg-white/[0.06] text-slate-200" variant="outline">
            {status}
          </Badge>
        </div>
        <p className="mt-3 text-xs text-slate-500">{timestamp}</p>
      </div>
    </motion.li>
  );
}
