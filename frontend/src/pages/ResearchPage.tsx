import ResearchReport from "@/components/research/ResearchReport";
import { motion } from "framer-motion";
import { useState } from "react";
import { conductResearch } from "@/services/research";
import {
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  FileStack,
  SlidersHorizontal,
} from "lucide-react";

import { SectionTitle } from "@/components/common/SectionTitle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { researchTemplates } from "@/lib/mockData";
import {
  fadeInUp,
  pageTransition,
  staggerContainer,
} from "@/lib/motion";

const planningStages = [
  {
    title: "Scope research question",
    status: "Ready",
    icon: BrainCircuit,
  },
  {
    title: "Collect source evidence",
    status: "Queued",
    icon: FileStack,
  },
  {
    title: "Prepare report outline",
    status: "Reserved",
    icon: BookOpenCheck,
  },
];

export function ResearchPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleResearch = async () => {
    if (!question.trim()) {
      alert("Please enter a research question.");
      return;
    }

    try {
      setLoading(true);

      const data = await conductResearch(question);

      console.log(JSON.stringify(data, null, 2));

      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };
    return (
    <motion.div className="space-y-8" {...pageTransition}>
      <SectionTitle
        eyebrow="Research Workspace"
        title="Plan a Source-Backed Investigation"
        description="A polished intake surface for future autonomous research planning."
        action={
          <Button
            onClick={handleResearch}
            disabled={loading}
            className="h-11 bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg shadow-blue-500/20"
          >
            {loading ? "Researching..." : "Start Research"}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Left Panel */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Research Question
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Structure the question before agent orchestration begins.
              </p>
            </div>

            <Badge
              variant="outline"
              className="border-violet-300/20 bg-violet-400/10 text-violet-100"
            >
              Draft
            </Badge>
          </div>

          <div className="space-y-4">
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-40 border-white/10 bg-slate-950/45 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-400/30"
              placeholder="Example: What evidence supports or contradicts the claim that remote work improves software engineering productivity?"
              aria-label="Research question"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Depth
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  Standard
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Citation Mode
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  Required
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Output
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  Professional Report
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid gap-4"
        >
          <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-blue-400/10 text-blue-100">
                <SlidersHorizontal className="size-5" aria-hidden="true" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Agent Run Plan
                </h2>

                <p className="text-sm text-slate-400">
                  Execution stages reserved for the future workflow.
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {planningStages.map((stage) => (
                <motion.div
                  key={stage.title}
                  variants={fadeInUp}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/45 p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/15 text-blue-100">
                      <stage.icon className="size-4" aria-hidden="true" />
                    </div>

                    <p className="truncate text-sm font-medium text-white">
                      {stage.title}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className="border-white/10 bg-white/[0.06] text-slate-200"
                  >
                    {stage.status}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl">
            <h2 className="text-lg font-semibold text-white">
              Research Templates
            </h2>

            <div className="mt-4 grid gap-3">
              {researchTemplates.map((template) => (
                <div
                  key={template}
                  className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm font-medium text-slate-200"
                >
                  {template}
                </div>
              ))}
            </div>
          </div>

          {result && <ResearchReport report={result.report} />}
        </motion.div>
      </section>
    </motion.div>
  );
}