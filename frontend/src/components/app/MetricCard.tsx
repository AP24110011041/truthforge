import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/cn";

type MetricTone = "teal" | "amber" | "rose" | "indigo";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: MetricTone;
};

const toneClassNames: Record<MetricTone, string> = {
  teal: "bg-teal-500/12 text-teal-700",
  amber: "bg-amber-500/14 text-amber-700",
  rose: "bg-rose-500/12 text-rose-700",
  indigo: "bg-indigo-500/12 text-indigo-700"
};

export function MetricCard({ label, value, detail, icon: Icon, tone }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-5">
        <div className={cn("grid size-10 shrink-0 place-items-center rounded-lg", toneClassNames[tone])}>
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-normal">{value}</p>
          <p className="text-xs leading-5 text-muted-foreground">{detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}
