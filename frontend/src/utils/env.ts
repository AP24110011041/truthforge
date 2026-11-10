const DEFAULT_API_BASE_URL = "http://127.0.0.1:8011/api/v1";

export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? "TruthForge AI",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL
} as const;
