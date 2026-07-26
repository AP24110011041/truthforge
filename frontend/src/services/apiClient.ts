import { env } from "@/utils/env";

type ApiClientOptions = RequestInit & {
  skipJsonContentType?: boolean;
};

export async function apiGet<TResponse>(path: string, options: ApiClientOptions = {}) {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(`TruthForge API request failed with status ${response.status}`);
  }

  return (await response.json()) as TResponse;
}
