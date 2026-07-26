import { motion } from "framer-motion";
import { ArrowRight, FileSearch, ShieldCheck, Sparkles } from "lucide-react";

import { ActivityItem } from "@/components/dashboard/ActivityItem";
import { AgentCard } from "@/components/dashboard/AgentCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Button } from "@/components/ui/button";
import { agents, dashboardStats, quickActions, recentActivities } from "@/lib/mockData";
import { fadeInUp, pageTransition, staggerContainer } from "@/lib/motion";

export function DashboardPage() {
  return (
    <motion.div className="space-y-8" {...pageTransition}>
      <motion.section
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/70 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(139,92,246,0.2),rgba(59,130,246,0.16),rgba(15,23,42,0.02))]" />
        <div className="relative grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-sm text-blue-100">
              <Sparkles className="size-4" aria-hidden="true" />
              Autonomous verification command center
            </div>
            <h1 className="text-4xl font-semibold tracking-normal text-white sm:text-5xl">
              Forge truth from noisy evidence with an AI-native research workspace.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Coordinate research planning, claim verification, contradiction review, citations, and reports from a single premium dashboard.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button className="h-11 bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg shadow-blue-500/20 hover:from-violet-400 hover:to-blue-400">
                Start Workspace
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <Button variant="outline" className="h-11 border-white/10 bg-white/[0.06] text-slate-200 hover:bg-white/[0.1] hover:text-white">
                View Reports
              </Button>
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/55 p-4 backdrop-blur-xl">
            {[
              { label: "Research plan", value: "Structured", icon: FileSearch },
              { label: "Claim review", value: "Evidence-first", icon: ShieldCheck },
              { label: "Report output", value: "Citation-ready", icon: Sparkles }
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.045] p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500/24 to-blue-500/20 text-blue-100">
                    <item.icon className="size-5" aria-hidden="true" />
                  </div>
                  <span className="truncate text-sm font-medium text-white">{item.label}</span>
                </div>
                <span className="shrink-0 text-sm text-slate-400">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        aria-label="Dashboard statistics"
      >
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="space-y-5">
          <SectionTitle
            eyebrow="Actions"
            title="Quick Actions"
            description="Launch the next verification workflow from reusable workspace entry points."
          />
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => (
              <QuickActionCard key={action.title} {...action} />
            ))}
          </motion.div>

          <SectionTitle eyebrow="Agents" title="Agent Readiness" description="Mock orchestration lanes for the future multi-agent workflow." />
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-4 md:grid-cols-2">
            {agents.slice(0, 4).map((agent) => (
              <AgentCard key={agent.name} {...agent} />
            ))}
          </motion.div>
        </section>

        <section className="space-y-5">
          <SectionTitle eyebrow="Timeline" title="Recent Activity" />
          <motion.ol variants={staggerContainer} initial="initial" animate="animate" className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20 backdrop-blur-2xl">
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.title} {...activity} />
            ))}
          </motion.ol>
        </section>
      </div>
    </motion.div>
  );
}
