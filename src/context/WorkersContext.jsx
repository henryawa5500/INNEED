import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/client";

const WorkersContext = createContext(null);

export function WorkersProvider({ children }) {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshWorkers = useCallback(async (query = "") => {
    setLoading(true);
    setError("");

    try {
      const path = query ? `/workers?${query}` : "/workers";
      const data = await apiRequest(path);
      setWorkers(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.message || "Failed to load workers.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshWorkers().catch(() => null);
  }, [refreshWorkers]);

  const addWorker = useCallback(async (payload, token) => {
    const created = await apiRequest("/workers", {
      method: "POST",
      token,
      body: payload,
    });

    setWorkers((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateWorker = useCallback(async (id, payload, token) => {
    const updated = await apiRequest(`/workers/${id}`, {
      method: "PUT",
      token,
      body: payload,
    });

    setWorkers((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  }, []);

  const deleteWorker = useCallback(async (id, token) => {
    await apiRequest(`/workers/${id}`, {
      method: "DELETE",
      token,
    });

    setWorkers((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const getWorkerById = useCallback(
    async (id) => {
      const existing = workers.find((item) => item.id === id);
      if (existing) return existing;

      const fetched = await apiRequest(`/workers/${id}`);
      setWorkers((prev) => {
        const exists = prev.some((item) => item.id === fetched.id);
        return exists ? prev : [fetched, ...prev];
      });
      return fetched;
    },
    [workers]
  );

  const value = useMemo(
    () => ({
      workers,
      loading,
      error,
      refreshWorkers,
      addWorker,
      updateWorker,
      deleteWorker,
      getWorkerById,
    }),
    [workers, loading, error, refreshWorkers, addWorker, updateWorker, deleteWorker, getWorkerById]
  );

  return <WorkersContext.Provider value={value}>{children}</WorkersContext.Provider>;
}

export function useWorkers() {
  const context = useContext(WorkersContext);
  if (!context) {
    throw new Error("useWorkers must be used inside WorkersProvider");
  }
  return context;
}
