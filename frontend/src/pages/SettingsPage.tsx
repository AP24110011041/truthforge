import { motion } from "framer-motion";
import { Bell, LockKeyhole, SlidersHorizontal } from "lucide-react";

import { SectionTitle } from "@/components/common/SectionTitle";
import { Badge } from "@/components/ui/badge";
import { platformReadiness } from "@/lib/mockData";
import { fadeInUp, pageTransition, staggerContainer } from "@/lib/motion";

export function SettingsPage() {
  return (
    <motion.div className="space-y-8" {...pageTransition}>
      <SectionTitle
        eyebrow="Settings"
        title="Workspace Preferences"
        description="Production-style controls for the future verification platform."
      />

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <motion.div variants={fadeInUp} initial="initial" animate="animate" className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-violet-400/10 text-violet-100">
              <SlidersHorizontal className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Interface Controls</h2>
              <p className="text-sm text-slate-400">Mock settings for a premium research workspace.</p>
            </div>
          </div>
          <div className="grid gap-3">
            {[
              ["Default confidence threshold", "85%"],
              ["Citation strictness", "High"],
              ["Report tone", "Executive"],
              ["Evidence freshness", "Recent-first"]
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <span className="text-sm text-slate-300">{label}</span>
                <Badge className="border-white/10 bg-white/[0.06] text-slate-200" variant="outline">
                  {value}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-4 sm:grid-cols-2">
          {platformReadiness.map((item) => (
            <motion.div key={item.label} variants={fadeInUp} className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20 backdrop-blur-2xl">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="grid size-10 place-items-center rounded-xl bg-blue-400/10 text-blue-100">
                  <item.icon className="size-5" aria-hidden="true" />
                </div>
                <Badge className="border-white/10 bg-white/[0.06] text-slate-200" variant="outline">
                  {item.value}
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-white">{item.label}</h3>
            </motion.div>
          ))}
          <motion.div variants={fadeInUp} className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/14 to-blue-500/10 p-5 shadow-xl shadow-black/20 backdrop-blur-2xl">
            <LockKeyhole className="mb-5 size-6 text-violet-100" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-white">Security Profile</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">Strict source verification and guarded report workflows.</p>
          </motion.div>
          <motion.div variants={fadeInUp} className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/14 to-cyan-400/10 p-5 shadow-xl shadow-black/20 backdrop-blur-2xl">
            <Bell className="mb-5 size-6 text-blue-100" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">Workspace alerts and report review reminders.</p>
          </motion.div>
        </motion.div>
      </section>
    </motion.div>
  );
}
