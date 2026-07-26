import { DatabaseZap, GitBranch, ShieldAlert } from "lucide-react";

import { AppNav } from "@/components/app/AppNav";
import { BrandMark } from "@/components/app/BrandMark";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const pipelineItems = [
  {
    label: "Research planner",
    status: "Ready",
    icon: GitBranch
  },
  {
    label: "Evidence vault",
    status: "Empty",
    icon: DatabaseZap
  },
  {
    label: "Claim ledger",
    status: "Idle",
    icon: ShieldAlert
  }
];

export function AppSidebar() {
  return (
    <div className="flex h-full flex-col p-5">
      <BrandMark />
      <Separator className="my-5 bg-sidebar-border" />
      <AppNav />

      <div className="mt-auto space-y-3 rounded-lg border border-sidebar-border bg-sidebar-accent/45 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-sidebar-foreground/60">Pipeline</p>
          <Badge variant="outline" className="border-sidebar-border text-sidebar-foreground">
            Setup
          </Badge>
        </div>
        <div className="grid gap-3">
          {pipelineItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <item.icon className="size-4 shrink-0 text-sidebar-primary" aria-hidden="true" />
                <span className="truncate text-sidebar-foreground/82">{item.label}</span>
              </div>
              <span className="shrink-0 text-xs text-sidebar-foreground/55">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
