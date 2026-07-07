import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "../api/axiosClient";

export const useAsyncData = (loadData, options = {}) => {
  const { enabled = true, initialData = null } = options;
  const [data, setData] = useState(initialData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(enabled));

  const refresh = useCallback(async () => {
    if (!enabled) {
      return null;
    }

    setLoading(true);
    setError("");

    try {
      const result = await loadData();
      setData(result);
      return result;
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [enabled, loadData]);

  useEffect(() => {
    if (enabled) {
      refresh().catch(() => {});
    } else {
      setLoading(false);
    }
  }, [enabled, refresh]);

  return {
    data,
    error,
    loading,
    refresh,
    setData,
  };
};
