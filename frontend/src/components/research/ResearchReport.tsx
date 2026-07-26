type Props = {
  report: any;
};

export default function ResearchReport({ report }: Props) {
  const confidence =
    (report.executive_summary?.overall_confidence ?? 0) * 100;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-6">
        <h1 className="text-3xl font-bold text-white">
          {report.metadata?.title}
        </h1>

        <p className="mt-2 text-slate-400">
          Generated on{" "}
          {report.metadata?.generated_at
            ? new Date(report.metadata.generated_at).toLocaleString()
            : "N/A"}
        </p>
      </div>

      {/* AI Agent Status */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-lg font-semibold text-white">
        AI Agent Status
      </h2>

      <p className="mt-2 text-slate-300">
        Research completed successfully.
      </p>
    </div>

    <div className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">
      Completed
    </div>
  </div>
</div>

      {/* Overview Cards */}
<div className="grid gap-4 md:grid-cols-4">

  <OverviewCard
    title="Confidence"
    value={`${(
      (report.executive_summary?.overall_confidence ?? 0) * 100
    ).toFixed(0)}%`}
    color="text-green-400"
  />

  <OverviewCard
    title="Quality"
    value={`${(
      (report.quality_metrics?.overall_quality_score ?? 0) * 100
    ).toFixed(0)}%`}
    color="text-yellow-400"
  />

  <OverviewCard
    title="Sources"
    value={report.research_findings?.total_sources}
    color="text-blue-400"
  />

  <OverviewCard
    title="Verified"
    value={report.fact_checking_results?.total_verified}
    color="text-purple-400"
  />

</div>

      {/* Research Question */}
      <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-6">
        <h2 className="text-xl font-semibold text-white">
          Research Question
        </h2>

        <p className="mt-4 text-slate-300">
          {report.executive_summary?.question}
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-6">
        <h2 className="text-xl font-semibold text-white">
          Executive Summary
        </h2>

        <p className="mt-4 text-slate-300">
          {report.executive_summary?.summary}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2">

        <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-6">
          <h3 className="text-blue-400 font-semibold">
            Confidence Score
          </h3>

          <div className="mt-4 h-3 w-full rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700"
              style={{ width: `${confidence}%` }}
            />
          </div>

          <p className="mt-3 text-2xl font-bold text-green-400">
            {confidence.toFixed(1)}%
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-6">
          <h3 className="text-yellow-400 font-semibold">
            Quality Score
          </h3>

          <p className="mt-4 text-3xl font-bold text-yellow-300">
            {((report.executive_summary?.quality_score ?? 0) * 100).toFixed(0)}%
          </p>
        </div>

      </div>

      {/* Findings */}
      <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-6">
        <h2 className="text-xl font-semibold text-white">
          Research Findings
        </h2>

        <p className="mt-4 text-slate-300">
          {report.research_findings?.key_findings}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">

          <div>
            <p className="text-slate-500 text-sm">
              Sources
            </p>

            <p className="text-2xl font-bold text-white">
              {report.research_findings?.total_sources}
            </p>
          </div>

          <div>
            <p className="text-slate-500 text-sm">
              Findings
            </p>

            <p className="text-2xl font-bold text-white">
              {report.research_findings?.total_findings}
            </p>
          </div>

        </div>
      </div>

      {/* Verification */}
      <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-6">
        <h2 className="text-xl font-semibold text-white">
          Fact Verification
        </h2>

        <div className="mt-6 grid md:grid-cols-3 gap-4">

          <div className="rounded-xl bg-green-500/10 p-4">
            <p className="text-green-400">
              Verified
            </p>

            <p className="text-3xl font-bold text-white">
              {report.fact_checking_results?.total_verified}
            </p>
          </div>

          <div className="rounded-xl bg-yellow-500/10 p-4">
            <p className="text-yellow-400">
              Partial
            </p>

            <p className="text-3xl font-bold text-white">
              {report.fact_checking_results?.total_partially_verified}
            </p>
          </div>

          <div className="rounded-xl bg-red-500/10 p-4">
            <p className="text-red-400">
              Unverified
            </p>

            <p className="text-3xl font-bold text-white">
              {report.fact_checking_results?.total_unverified}
            </p>
          </div>

        </div>
      </div>

      {/* Hallucination Analysis */}

      <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-6">
        <h2 className="text-xl font-semibold text-white">
          Hallucination Analysis
        </h2>

        <div className="mt-5 grid md:grid-cols-2 gap-6">

          <div>
            <p className="text-slate-500 text-sm">
              Risk Level
            </p>

            <p className="mt-2 text-2xl font-bold text-green-400 capitalize">
              {report.hallucination_analysis?.risk_level}
            </p>
          </div>

          <div>
            <p className="text-slate-500 text-sm">
              Hallucination Score
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {report.hallucination_analysis?.hallucination_score}
            </p>
          </div>

        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-white">
            Recommendations
          </h3>

          <ul className="mt-4 list-disc list-inside space-y-2 text-slate-300">
            {report.hallucination_analysis?.recommendations?.map(
              (item: string, index: number) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>
        </div>
      </div>

      {/* Quality Metrics */}

      <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-6">

        <h2 className="text-xl font-semibold text-white">
          Quality Metrics
        </h2>

        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">

          <Metric
            title="Source Diversity"
            value={report.quality_metrics?.source_diversity}
          />

          <Metric
            title="Completeness"
            value={report.quality_metrics?.information_completeness}
          />

          <Metric
            title="Verification"
            value={report.quality_metrics?.verification_coverage}
          />

          <Metric
            title="Citation Accuracy"
            value={report.quality_metrics?.citation_accuracy}
          />

        </div>

      </div>

      {/* Citations */}

      <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-6">

        <h2 className="text-xl font-semibold text-white">
          References (APA)
        </h2>

        <div className="mt-5 space-y-4">

          {report.citations?.apa?.map(
            (citation: string, index: number) => (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-slate-300"
              >
                {citation}
              </div>
            )
          )}

        </div>

      </div>

      {/* Verification Details */}

      <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-6">
        <h2 className="text-xl font-semibold text-white">
          Verification Details
        </h2>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="pb-3">Finding</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Confidence</th>
                <th className="pb-3">Evidence</th>
              </tr>
            </thead>

            <tbody>
              {report.fact_checking_results?.details?.map(
                (item: any) => (
                  <tr
                    key={item.finding_id}
                    className="border-b border-white/5"
                  >
                    <td className="py-4 text-white">
                      {item.finding_id}
                    </td>

                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          item.status === "verified"
                            ? "bg-green-500/20 text-green-400"
                            : item.status === "partially_verified"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {item.status?.replace("_", " ") ?? "Unknown"}
                      </span>
                    </td>

                    <td className="py-4 text-cyan-300">
                      {((item.confidence ?? 0) * 100).toFixed(0)}%
                    </td>

                    <td className="py-4 text-slate-300">
                      {item.supporting_evidence_count}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overall Statistics */}

      <div className="grid gap-4 md:grid-cols-4">

        <StatCard
          title="Sources"
          value={report.research_findings?.total_sources}
        />

        <StatCard
          title="Findings"
          value={report.research_findings?.total_findings}
        />

        <StatCard
          title="Citations"
          value={report.citations?.total_citations}
        />

        <StatCard
          title="Overall Quality"
          value={`${(
            (report.quality_metrics?.overall_quality_score ?? 0) * 100
          ).toFixed(0)}%`}
        />

      </div>

    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value?: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
      <p className="text-sm text-slate-400">{title}</p>

      <p className="mt-3 text-3xl font-bold text-cyan-400">
        {((value ?? 0) * 100).toFixed(0)}%
      </p>
    </div>
  );
}

function OverviewCard({
  title,
  value,
  color,
}: {
  title: string;
  value?: string | number;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className={`mt-3 text-3xl font-bold ${color}`}>
        {value ?? "N/A"}
      </p>
    </div>
  );
}