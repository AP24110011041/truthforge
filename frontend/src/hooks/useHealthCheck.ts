import { apiGet } from "@/services/apiClient";
import type { ServiceHealth } from "@/types/health";
import { useEffect, useState } from "react";

type HealthState = {
  data: ServiceHealth | null;
  isLoading: boolean;
  isOnline: boolean;
};

export function useHealthCheck() {
  const [state, setState] = useState<HealthState>({
    data: null,
    isLoading: true,
    isOnline: false
  });

  useEffect(() => {
    let isMounted = true;

    apiGet<ServiceHealth>("/health")
      .then((data) => {
        if (isMounted) {
          setState({ data, isLoading: false, isOnline: true });
        }
      })
      .catch(() => {
        if (isMounted) {
          setState({ data: null, isLoading: false, isOnline: false });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
