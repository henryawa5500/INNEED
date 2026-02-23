import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/client";

const JobsContext = createContext(null);

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshJobs = useCallback(async (query = "") => {
    setLoading(true);
    setError("");

    try {
      const path = query ? `/jobs?${query}` : "/jobs";
      const data = await apiRequest(path);
      setJobs(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.message || "Failed to load jobs.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshJobs().catch(() => null);
  }, [refreshJobs]);

  const addJob = useCallback(async (payload, token) => {
    const created = await apiRequest("/jobs", {
      method: "POST",
      token,
      body: payload,
    });

    setJobs((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateJob = useCallback(async (id, payload, token) => {
    const updated = await apiRequest(`/jobs/${id}`, {
      method: "PUT",
      token,
      body: payload,
    });

    setJobs((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  }, []);

  const deleteJob = useCallback(async (id, token) => {
    await apiRequest(`/jobs/${id}`, {
      method: "DELETE",
      token,
    });

    setJobs((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const getJobById = useCallback(
    async (id) => {
      const existing = jobs.find((item) => item.id === id);
      if (existing) return existing;

      const fetched = await apiRequest(`/jobs/${id}`);
      setJobs((prev) => {
        const exists = prev.some((item) => item.id === fetched.id);
        return exists ? prev : [fetched, ...prev];
      });
      return fetched;
    },
    [jobs]
  );

  const value = useMemo(
    () => ({
      jobs,
      loading,
      error,
      refreshJobs,
      addJob,
      updateJob,
      deleteJob,
      getJobById,
    }),
    [jobs, loading, error, refreshJobs, addJob, updateJob, deleteJob, getJobById]
  );

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobs must be used inside JobsProvider");
  }
  return context;
}
