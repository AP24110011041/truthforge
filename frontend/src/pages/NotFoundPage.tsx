import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-xl place-items-center text-center">
      <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-8 shadow-2xl shadow-black/20 backdrop-blur-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">The requested TruthForge workspace route does not exist.</p>
        <Button asChild className="mt-6 bg-gradient-to-r from-violet-500 to-blue-500 text-white">
          <Link to="/">Return to overview</Link>
        </Button>
      </div>
    </div>
  );
}
