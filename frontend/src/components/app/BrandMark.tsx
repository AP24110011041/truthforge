import { ShieldCheck } from "lucide-react";

export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <ShieldCheck className="size-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">TruthForge AI</p>
        <p className="truncate text-xs text-sidebar-foreground/70">Forge Truth. Verify Every Claim.</p>
      </div>
    </div>
  );
}
