import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Loader2,
  ScanSearch,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";

import { env } from "@/utils/env";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/bmp",
  "image/gif",
  "image/webp",
];

type TigasPrediction = {
  model: string;
  predicted_class: "REAL" | "FAKE";
  model_scores: { REAL: number; FAKE: number };
  score_type: string;
  warning: string;
  original_dimensions: [number, number];
  model_input_dimensions: [number, number];
  preprocessing_policy: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDimensionPair(value: unknown, minimum: number): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((dimension) => Number.isInteger(dimension) && dimension >= minimum)
  );
}

function isTigasPrediction(value: unknown): value is TigasPrediction {
  if (!isRecord(value) || !isRecord(value.model_scores)) return false;

  return (
    (value.predicted_class === "REAL" || value.predicted_class === "FAKE") &&
    typeof value.model === "string" &&
    typeof value.model_scores.REAL === "number" &&
    Number.isFinite(value.model_scores.REAL) &&
    typeof value.model_scores.FAKE === "number" &&
    Number.isFinite(value.model_scores.FAKE) &&
    typeof value.score_type === "string" &&
    typeof value.warning === "string" &&
    typeof value.preprocessing_policy === "string" &&
    isDimensionPair(value.original_dimensions, 1) &&
    isDimensionPair(value.model_input_dimensions, 256)
  );
}

export default function TigasPredictPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [prediction, setPrediction] = useState<TigasPrediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  function clearPreview() {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
    setPreviewUrl("");
  }

  function selectFile(selected: File | undefined) {
    if (!selected) return;

    setPrediction(null);
    setError(null);

    if (!ALLOWED_TYPES.includes(selected.type)) {
      clearPreview();
      setFile(null);
      setError("Please select a JPEG, PNG, BMP, GIF or WebP image.");
      return;
    }

    if (selected.size > MAX_UPLOAD_BYTES) {
      clearPreview();
      setFile(null);
      setError("The selected image exceeds the 10 MiB upload limit.");
      return;
    }

    clearPreview();
    const url = URL.createObjectURL(selected);
    previewRef.current = url;
    setPreviewUrl(url);
    setFile(selected);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0]);
    event.target.value = "";
  }

  async function submitPrediction() {
    if (!file || loading) return;

    setLoading(true);
    setError(null);
    setPrediction(null);

    const body = new FormData();
    body.append("file", file);

    try {
      const response = await fetch(`${env.apiBaseUrl}/tigas/predict`, {
        method: "POST",
        body,
      });

      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const detail =
          isRecord(payload) && typeof payload.detail === "string"
            ? payload.detail
            : `Prediction request failed (${response.status}).`;
        throw new Error(detail);
      }

      if (!isTigasPrediction(payload)) {
        throw new Error("The API returned an invalid prediction response.");
      }

      setPrediction(payload);
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to connect to the prediction service."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/5 px-3 py-1.5 text-xs font-medium text-blue-300">
            <span className="size-2 rounded-full bg-emerald-400" />
            CNN RESEARCH PROTOTYPE
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            AI Image
            <span className="block text-blue-400">Authenticity Detector</span>
          </h1>

          <p className="max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            Analyze an image using a Convolutional Neural Network and classify
            it as REAL or FAKE. Upload an image to begin the analysis.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {["TIGAS CNN", "REAL / FAKE", "512 × 512 input"].map((item) => (
              <span
                key={item}
                className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-slate-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto flex h-64 w-full max-w-sm items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.16),transparent_68%)]" />
          <div className="absolute left-8 top-8 size-1 rounded-full bg-blue-400/70" />
          <div className="absolute right-12 top-12 size-1.5 rounded-full bg-violet-400/70" />
          <div className="absolute bottom-10 left-16 size-1.5 rounded-full bg-cyan-400/70" />

          <div className="relative flex size-48 items-center justify-center">
            <div
              className="absolute h-28 w-36 rounded-xl border border-blue-400/60 bg-blue-500/10 shadow-[0_18px_45px_rgba(37,99,235,0.16)]"
              style={{ transform: "rotateX(55deg) rotateZ(-35deg) translateY(35px)" }}
            />
            <div
              className="absolute h-28 w-36 rounded-xl border border-violet-400/60 bg-violet-500/10"
              style={{ transform: "rotateX(55deg) rotateZ(-35deg) translateY(8px)" }}
            />
            <div
              className="absolute grid h-28 w-36 place-items-center rounded-xl border border-cyan-300/70 bg-gradient-to-br from-blue-500/30 to-cyan-400/10 shadow-[0_12px_35px_rgba(34,211,238,0.14)]"
              style={{ transform: "rotateX(55deg) rotateZ(-35deg) translateY(-19px)" }}
            >
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, index) => (
                  <span
                    key={index}
                    className={`size-3 rounded-sm ${
                      index === 4
                        ? "bg-cyan-300"
                        : index % 2 === 0
                          ? "bg-blue-400"
                          : "bg-violet-400"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="absolute bottom-1 flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-300">
              <ScanSearch className="size-3.5 text-cyan-300" />
              CNN image analysis
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-slate-900/65 p-5 shadow-xl shadow-black/10 sm:p-7">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white">Upload an image</h2>
          <p className="mt-1 text-sm text-slate-400">
            Select an image from your device. Maximum file size: 10 MiB.
          </p>
        </div>

        <label
          htmlFor="tigas-image"
          className="group flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-600 bg-slate-950/40 px-5 py-7 text-center transition-colors hover:border-blue-400/70 hover:bg-blue-500/[0.04]"
        >
          <div className="mb-3 grid size-12 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300 transition-transform group-hover:-translate-y-1">
            {previewUrl ? (
              <ImagePlus className="size-6" />
            ) : (
              <UploadCloud className="size-6" />
            )}
          </div>
          <span className="text-sm font-semibold text-slate-200">
            {file ? "Choose a different image" : "Choose an image to upload"}
          </span>
          <span className="mt-1 text-xs text-slate-500">
            JPEG, PNG, BMP, GIF or WebP
          </span>
          <input
            id="tigas-image"
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>

        {previewUrl && file && (
          <div className="mt-5 flex flex-col gap-4 rounded-xl border border-white/10 bg-slate-950/50 p-4 sm:flex-row sm:items-center">
            <img
              src={previewUrl}
              alt="Selected image preview"
              className="max-h-64 w-full rounded-lg object-contain sm:w-48"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{file.name}</p>
              <p className="mt-1 text-xs text-slate-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MiB
              </p>
              <p className="mt-3 text-xs text-emerald-300">
                <CheckCircle2 className="mr-1 inline size-3.5" />
                Image ready for analysis
              </p>
            </div>
          </div>
        )}

        {error && (
          <div role="alert" className="mt-4 flex items-start gap-2 rounded-lg border border-red-400/20 bg-red-500/5 p-3 text-sm text-red-300">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={submitPrediction}
          disabled={!file || loading}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-900/40 active:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Analyzing image...
            </>
          ) : (
            <>
              <ScanSearch className="size-4" />
              Analyze Image
            </>
          )}
        </button>
      </section>

      {prediction && (
        <section
          aria-live="polite"
          className="rounded-2xl border border-white/10 bg-slate-900/65 p-5 shadow-xl shadow-black/10 sm:p-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Classification result
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white">
                {prediction.predicted_class}
              </h2>
            </div>
            <span
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                prediction.predicted_class === "REAL"
                  ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
                  : "border-amber-400/25 bg-amber-400/10 text-amber-300"
              }`}
            >
              {prediction.predicted_class === "REAL" ? "REAL classification" : "FAKE classification"}
            </span>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {(["REAL", "FAKE"] as const).map((label) => {
              const score = prediction.model_scores[label];
              return (
                <div key={label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-slate-300">{label}</span>
                    <span className="tabular-nums text-white">{score.toFixed(4)}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        label === "REAL" ? "bg-blue-500" : "bg-violet-500"
                      }`}
                      style={{ width: `${Math.max(0, Math.min(100, score * 100))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-500">{prediction.score_type}</p>

          <div className="mt-6 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">Original image dimensions</p>
              <p className="mt-1 text-sm font-medium text-slate-200">
                {prediction.original_dimensions[0]} × {prediction.original_dimensions[1]}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Model input dimensions</p>
              <p className="mt-1 text-sm font-medium text-slate-200">
                {prediction.model_input_dimensions[0]} × {prediction.model_input_dimensions[1]}
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-2 rounded-lg border border-white/10 bg-slate-950/50 p-3">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-blue-300" />
            <p className="text-xs leading-5 text-slate-400">{prediction.warning}</p>
          </div>
        </section>
      )}

      <footer className="pb-4 text-center">
        <p className="text-xs text-slate-500">
          TruthForge AI · TIGAS CNN · Academic research prototype
        </p>
        <p className="mt-1 text-xs text-slate-600">
          Model scores are uncalibrated and should not be treated as forensic proof.
        </p>
      </footer>
    </div>
  );
}
