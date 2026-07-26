import { cn } from "@/utils/cn";

type LoadingSkeletonProps = {
  className?: string;
  lines?: number;
};

export function LoadingSkeleton({ className, lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-white/[0.04] p-5", className)}>
      <div className="mb-5 h-8 w-28 animate-pulse rounded-lg bg-white/10" />
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className="h-3 animate-pulse rounded-full bg-white/10"
            style={{ width: `${88 - index * 14}%` }}
          />
        ))}
      </div>
    </div>
  );
}
