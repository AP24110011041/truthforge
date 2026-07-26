import { motion } from "framer-motion";
import { BookOpenCheck, CircleGauge, FileSearch, ShieldCheck } from "lucide-react";

import { MetricCard } from "@/components/app/MetricCard";
import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const verificationLanes = [
  "Research planning",
  "Evidence collection",
  "Claim verification",
  "Contradiction review",
  "Report generation"
];

const recentWorkspaces = [
  {
    title: "AI regulation source audit",
    status: "Draft",
    score: "0%"
  },
  {
    title: "Climate policy claim map",
    status: "Queued",
    score: "0%"
  },
  {
    title: "Healthcare funding analysis",
    status: "Queued",
    score: "0%"
  }
];

export function HomePage() {
  return (
    <motion.div
      className="mx-auto flex w-full max-w-7xl flex-col gap-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <PageHeader
        eyebrow="Command center"
        title="TruthForge AI"
        description="A source-backed workspace for research planning, claim review, contradiction analysis, and professional report delivery."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Workspace metrics">
        <MetricCard
          label="Active research"
          value="0"
          detail="Workspace ready for orchestration"
          icon={FileSearch}
          tone="teal"
        />
        <MetricCard label="Evidence items" value="0" detail="Citation store is empty" icon={BookOpenCheck} tone="indigo" />
        <MetricCard label="Confidence baseline" value="0%" detail="Scoring awaits verified claims" icon={CircleGauge} tone="amber" />
        <MetricCard label="Reports" value="0" detail="No generated reports yet" icon={ShieldCheck} tone="rose" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Verification Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-5">
              {verificationLanes.map((lane, index) => (
                <div key={lane} className="rounded-lg border bg-muted/35 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="grid size-7 place-items-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <Badge variant="outline">Idle</Badge>
                  </div>
                  <p className="min-h-10 text-sm font-medium leading-5">{lane}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Workspaces</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {recentWorkspaces.map((workspace) => (
              <div key={workspace.title} className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{workspace.title}</p>
                  <p className="text-xs text-muted-foreground">{workspace.status}</p>
                </div>
                <Badge variant="secondary">{workspace.score}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </motion.div>
  );
}
