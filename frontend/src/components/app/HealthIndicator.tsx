import { Activity } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useHealthCheck } from "@/hooks/useHealthCheck";
import { cn } from "@/utils/cn";

export function HealthIndicator() {
  const { isLoading, isOnline, data } = useHealthCheck();
  const label = isLoading ? "Checking API" : isOnline ? data?.environment ?? "Online" : "API Offline";

  return (
    <Badge variant={isOnline ? "default" : "outline"} className="gap-2">
      <span
        className={cn(
          "size-2 rounded-full",
          isLoading ? "bg-amber-500" : isOnline ? "bg-emerald-300" : "bg-rose-500"
        )}
      />
      <Activity className="size-3.5" aria-hidden="true" />
      {label}
    </Badge>
  );
}
