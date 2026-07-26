import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fadeInUp } from "@/lib/motion";
import { cn } from "@/utils/cn";

type QuickActionCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
};

export function QuickActionCard({ title, description, icon: Icon, gradient }: QuickActionCardProps) {
  return (
    <motion.article
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      className="group rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-xl shadow-black/20 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div className={cn("grid size-11 place-items-center rounded-xl bg-gradient-to-br text-white", gradient)}>
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-slate-400 hover:bg-white/10 hover:text-white"
          aria-label={title}
        >
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Button>
      </div>
      <div className="mt-5">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      </div>
    </motion.article>
  );
}
