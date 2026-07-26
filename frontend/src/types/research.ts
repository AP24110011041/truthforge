export type ResearchStage = "planning" | "evidence" | "verification" | "reporting";

export type ResearchWorkspaceSummary = {
  id: string;
  title: string;
  stage: ResearchStage;
  confidence: number;
  updatedAt: string;
};
