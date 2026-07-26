import { motion } from "framer-motion";
import { Activity, GitBranch, RadioTower } from "lucide-react";

import { AgentCard } from "@/components/dashboard/AgentCard";
import { SectionTitle } from "@/components/common/SectionTitle";
import { agents } from "@/lib/mockData";
import { fadeInUp, pageTransition, staggerContainer } from "@/lib/motion";

export function AgentsPage() {
  return (
    <motion.div className="space-y-8" {...pageTransition}>
      <SectionTitle
        eyebrow="Agents"
        title="Multi-Agent Operations"
        description="Visual readiness states for planner, evidence, verifier, contradiction, and reporting agents."
      />

      <motion.section variants={staggerContainer} initial="initial" animate="animate" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {agents.map((agent) => (
          <AgentCard key={agent.name} {...agent} />
        ))}
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <motion.div variants={fadeInUp} initial="initial" animate="animate" className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-violet-400/10 text-violet-100">
              <GitBranch className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Orchestration Map</h2>
              <p className="text-sm text-slate-400">Reserved visual flow for LangGraph execution.</p>
            </div>
          </div>
          <div className="grid gap-3">
            {["Planner", "Evidence", "Verifier", "Contradictions", "Report"].map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500/24 to-blue-500/16 text-xs font-semibold text-blue-100">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-slate-200">{step}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} initial="initial" animate="animate" className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Runtime Signals</h2>
              <p className="mt-1 text-sm text-slate-400">Mock telemetry for the future agent service layer.</p>
            </div>
            <RadioTower className="size-5 text-blue-200" aria-hidden="true" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Latency Budget", "2.4s"],
              ["Queue Depth", "0"],
              ["Guardrail Mode", "Strict"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/45 p-5">
                <Activity className="mb-4 size-5 text-cyan-200" aria-hidden="true" />
                <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-2 text-xl font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
