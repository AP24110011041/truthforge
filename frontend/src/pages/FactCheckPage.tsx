import { motion } from "framer-motion";
import { CheckCircle2, CircleAlert, Gauge, ShieldQuestion } from "lucide-react";

import { SectionTitle } from "@/components/common/SectionTitle";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { factCheckQueue } from "@/lib/mockData";
import { fadeInUp, pageTransition, staggerContainer } from "@/lib/motion";

export function FactCheckPage() {
  return (
    <motion.div className="space-y-8" {...pageTransition}>
      <SectionTitle
        eyebrow="Fact Check"
        title="Claim Verification Console"
        description="A glass command surface for future single-claim verification runs."
      />

      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <motion.div variants={fadeInUp} initial="initial" animate="animate" className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-violet-500/22 to-blue-500/18 text-blue-100">
              <ShieldQuestion className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Claim Input</h2>
              <p className="text-sm text-slate-400">Paste a claim for future evidence-backed assessment.</p>
            </div>
          </div>
          <Textarea
            className="min-h-44 border-white/10 bg-slate-950/45 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-400/30"
            placeholder="Example: Electric vehicles always produce fewer lifecycle emissions than gasoline vehicles."
            aria-label="Claim input"
          />
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button className="h-11 bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg shadow-blue-500/20">
              Prepare Verification
            </Button>
            <Button variant="outline" className="h-11 border-white/10 bg-white/[0.06] text-slate-200 hover:bg-white/[0.1] hover:text-white">
              Save Draft
            </Button>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} initial="initial" animate="animate" className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-white">Confidence Preview</h2>
            <Gauge className="size-5 text-blue-200" aria-hidden="true" />
          </div>
          <div className="grid place-items-center rounded-3xl border border-white/10 bg-slate-950/45 p-8">
            <div className="grid size-40 place-items-center rounded-full border border-blue-300/20 bg-gradient-to-br from-violet-500/20 to-blue-500/20">
              <div className="text-center">
                <p className="text-4xl font-semibold text-white">--</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Pending</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="space-y-5">
        <SectionTitle eyebrow="Queue" title="Claims Awaiting Review" />
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-4 lg:grid-cols-3">
          {factCheckQueue.map((item) => (
            <motion.article key={item.claim} variants={fadeInUp} whileHover={{ y: -4 }} className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20 backdrop-blur-2xl">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="grid size-10 place-items-center rounded-xl bg-blue-400/10 text-blue-100">
                  <CheckCircle2 className="size-5" aria-hidden="true" />
                </div>
                <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-100">
                  {item.severity}
                </span>
              </div>
              <p className="min-h-20 text-sm leading-6 text-slate-200">{item.claim}</p>
              <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
                <CircleAlert className="size-4" aria-hidden="true" />
                Confidence {item.confidence}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
}
