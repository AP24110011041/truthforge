import { motion } from "framer-motion";
import { Download, FileText, MoreHorizontal, Presentation } from "lucide-react";

import { SectionTitle } from "@/components/common/SectionTitle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { reportLibrary } from "@/lib/mockData";
import { fadeInUp, pageTransition, staggerContainer } from "@/lib/motion";

export function ReportsPage() {
  return (
    <motion.div className="space-y-8" {...pageTransition}>
      <SectionTitle
        eyebrow="Reports"
        title="Professional Report Library"
        description="Presentation-ready report shells for cited research output."
        action={
          <Button variant="outline" className="h-11 border-white/10 bg-white/[0.06] text-slate-200 hover:bg-white/[0.1] hover:text-white">
            <Download className="size-4" aria-hidden="true" />
            Export
          </Button>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <div className="overflow-x-auto">
            <div className="min-w-[740px]">
              <div className="grid grid-cols-[1fr_150px_120px_48px] gap-4 border-b border-white/10 px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                <span>Title</span>
                <span>Type</span>
                <span>Status</span>
                <span />
              </div>
              {reportLibrary.map((report) => (
                <motion.div
                  key={report.title}
                  variants={fadeInUp}
                  className="grid grid-cols-[1fr_150px_120px_48px] items-center gap-4 border-b border-white/10 px-4 py-4 last:border-b-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-400/10 text-blue-100">
                      <FileText className="size-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{report.title}</p>
                      <p className="text-xs text-slate-500">{report.updatedAt}</p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-400">{report.type}</span>
                  <Badge className="w-fit border-white/10 bg-white/[0.06] text-slate-200" variant="outline">
                    {report.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:bg-white/10 hover:text-white" aria-label={`Open ${report.title}`}>
                    <MoreHorizontal className="size-4" aria-hidden="true" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} initial="initial" animate="animate" className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/16 via-blue-500/12 to-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <div className="grid size-12 place-items-center rounded-2xl bg-white/10 text-blue-100">
            <Presentation className="size-6" aria-hidden="true" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-white">Report Preview</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Executive summary, claim ledger, contradiction table, citation appendix, and confidence score sections are staged for future generation.
          </p>
          <div className="mt-6 space-y-3">
            {["Executive Summary", "Evidence Matrix", "Citation Appendix"].map((section) => (
              <div key={section} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm font-medium text-slate-200">
                {section}
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
