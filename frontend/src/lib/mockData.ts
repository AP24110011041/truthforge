import {
  Activity,
  Bot,
  BrainCircuit,
  Database,
  FileCheck2,
  FileSearch,
  FileText,
  Gauge,
  GitCompareArrows,
  Layers3,
  Network,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Zap
} from "lucide-react";

export const dashboardStats = [
  {
    label: "Research Completed",
    value: "128",
    trend: "+18.4%",
    description: "verified reports this quarter",
    icon: FileCheck2,
    tone: "violet"
  },
  {
    label: "Verified Claims",
    value: "14.7k",
    trend: "+32.1%",
    description: "claim checks indexed",
    icon: ShieldCheck,
    tone: "blue"
  },
  {
    label: "Active Agents",
    value: "12",
    trend: "Live",
    description: "orchestration lanes ready",
    icon: Bot,
    tone: "cyan"
  },
  {
    label: "Documents Indexed",
    value: "82k",
    trend: "+9.8%",
    description: "sources prepared for review",
    icon: Database,
    tone: "amber"
  }
] as const;

export const recentActivities = [
  {
    title: "Evidence graph prepared",
    description: "Climate policy dataset staged for source mapping.",
    timestamp: "2 min ago",
    status: "Indexed"
  },
  {
    title: "Contradiction lane queued",
    description: "Economic impact claims ready for cross-source review.",
    timestamp: "18 min ago",
    status: "Queued"
  },
  {
    title: "Citation template updated",
    description: "Professional report format synchronized across workspaces.",
    timestamp: "42 min ago",
    status: "Updated"
  },
  {
    title: "Agent profile calibrated",
    description: "Verifier guardrails aligned to conservative confidence scoring.",
    timestamp: "1 hr ago",
    status: "Ready"
  }
] as const;

export const quickActions = [
  {
    title: "New Research Workspace",
    description: "Start a guided claim investigation.",
    icon: FileSearch,
    gradient: "from-violet-500 to-blue-500"
  },
  {
    title: "Run Fact Check",
    description: "Validate a single claim against evidence.",
    icon: SearchCheck,
    gradient: "from-blue-500 to-cyan-400"
  },
  {
    title: "Review Agents",
    description: "Inspect verification lanes and readiness.",
    icon: BrainCircuit,
    gradient: "from-fuchsia-500 to-violet-500"
  }
] as const;

export const agents = [
  {
    name: "Research Planner",
    role: "Breaks questions into verifiable paths.",
    status: "Ready",
    icon: Network,
    load: 72
  },
  {
    name: "Evidence Collector",
    role: "Prepares source intake and citation queues.",
    status: "Ready",
    icon: Layers3,
    load: 64
  },
  {
    name: "Claim Verifier",
    role: "Assesses support, uncertainty, and source fit.",
    status: "Idle",
    icon: ShieldCheck,
    load: 48
  },
  {
    name: "Contradiction Detector",
    role: "Highlights source conflict patterns.",
    status: "Queued",
    icon: GitCompareArrows,
    load: 38
  }
] as const;

export const researchTemplates = [
  "Market analysis verification brief",
  "Scientific claim evidence map",
  "Policy statement source audit",
  "Public narrative contradiction review"
] as const;

export const factCheckQueue = [
  {
    claim: "Remote work improves software engineering productivity.",
    confidence: "Pending",
    severity: "Medium"
  },
  {
    claim: "Synthetic media detection has reached near-perfect accuracy.",
    confidence: "Pending",
    severity: "High"
  },
  {
    claim: "Renewable energy storage costs fell sharply over the last decade.",
    confidence: "Pending",
    severity: "Low"
  }
] as const;

export const reportLibrary = [
  {
    title: "AI Regulation Source Audit",
    type: "Executive Brief",
    status: "Template",
    updatedAt: "Today"
  },
  {
    title: "Healthcare Funding Claim Map",
    type: "Evidence Report",
    status: "Template",
    updatedAt: "Yesterday"
  },
  {
    title: "Climate Policy Contradiction Review",
    type: "Citation Report",
    status: "Template",
    updatedAt: "Jul 22"
  }
] as const;

export const platformReadiness = [
  {
    label: "FastAPI Gateway",
    value: "Configured",
    icon: Zap
  },
  {
    label: "Agent Orchestration",
    value: "Reserved",
    icon: Activity
  },
  {
    label: "Report Templates",
    value: "Ready",
    icon: FileText
  },
  {
    label: "Scoring Controls",
    value: "Reserved",
    icon: Gauge
  },
  {
    label: "Research Workspace",
    value: "Ready",
    icon: Sparkles
  }
] as const;
