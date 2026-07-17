import { useCallback, useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "../api/axiosClient";

export const useAsyncData = (loadData, options = {}) => {
  const { enabled = true, initialData = null } = options;
  const [data, setStoredData] = useState(initialData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(enabled));
  const latestRequestId = useRef(0);

  const setData = useCallback((nextData) => {
    latestRequestId.current += 1;
    setStoredData(nextData);
    setError("");
    setLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    if (!enabled) {
      return null;
    }

    const requestId = latestRequestId.current + 1;
    latestRequestId.current = requestId;
    setLoading(true);
    setError("");

    try {
      const result = await loadData();
      if (latestRequestId.current === requestId) {
        setStoredData(result);
      }
      return result;
    } catch (err) {
      if (latestRequestId.current === requestId) {
        const message = getApiErrorMessage(err);
        setError(message);
      }
      throw err;
    } finally {
      if (latestRequestId.current === requestId) {
        setLoading(false);
      }
    }
  }, [enabled, loadData]);

  useEffect(() => {
    if (enabled) {
      refresh().catch(() => {});
    } else {
      latestRequestId.current += 1;
      setLoading(false);
    }

    return () => {
      latestRequestId.current += 1;
    };
  }, [enabled, refresh]);

  return {
    data,
    error,
    loading,
    refresh,
    setData,
  };
};
