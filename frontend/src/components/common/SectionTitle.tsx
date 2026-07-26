import type { ReactNode } from "react";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionTitle({ eyebrow, title, description, action }: SectionTitleProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">{eyebrow}</p>
        ) : null}
        <div>
          <h2 className="text-xl font-semibold tracking-normal text-white sm:text-2xl">{title}</h2>
          {description ? <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
