import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jobs as seedJobs } from "../data/jobs";

const JobsContext = createContext(null);
const STORAGE_KEY = "inneed_jobs_v1";

function readStoredJobs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedJobs;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return seedJobs;
    return parsed;
  } catch {
    return seedJobs;
  }
}

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState(readStoredJobs);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  }, [jobs]);

  const addJob = (payload) => {
    const created = {
      id: `job-${Date.now()}`,
      title: payload.title.trim(),
      category: payload.category,
      location: payload.location.trim(),
      pay: payload.pay.trim(),
      type: payload.type,
      postedBy: payload.postedBy.trim(),
      description: payload.description.trim(),
      requirements: payload.requirements,
      contactWhatsapp: payload.contactWhatsapp.trim(),
    };

    setJobs((prev) => [created, ...prev]);
    return created;
  };

  const value = useMemo(
    () => ({
      jobs,
      addJob,
    }),
    [jobs]
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
