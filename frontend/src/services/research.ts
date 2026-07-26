import { api } from "./api";

export interface ResearchRequest {
  question: string;
}

export async function conductResearch(question: string) {
  const response = await api.post("/research", {
    question,
  });

  return response.data;
}