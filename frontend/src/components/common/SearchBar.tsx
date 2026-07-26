import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";

type SearchBarProps = {
  className?: string;
};

export function SearchBar({ className }: SearchBarProps) {
  return (
    <div className={cn("relative flex min-w-0 items-center gap-2", className)}>
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          className="h-11 border-white/10 bg-white/[0.06] pl-10 pr-3 text-slate-100 shadow-inner shadow-black/10 placeholder:text-slate-500 focus-visible:ring-blue-400/35"
          placeholder="Search claims, sources, reports"
          aria-label="Global search"
        />
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-11 w-11 border-white/10 bg-white/[0.06] text-slate-300 hover:bg-white/[0.1] hover:text-white"
        aria-label="Search filters"
      >
        <SlidersHorizontal className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
