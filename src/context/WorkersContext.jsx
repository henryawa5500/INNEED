import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { workers as seedWorkers } from "../data/workers";

const WorkersContext = createContext(null);
const STORAGE_KEY = "inneed_workers_v1";

function readStoredWorkers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedWorkers;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return seedWorkers;
    return parsed;
  } catch {
    return seedWorkers;
  }
}

export function WorkersProvider({ children }) {
  const [workers, setWorkers] = useState(readStoredWorkers);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workers));
  }, [workers]);

  const addWorker = (payload) => {
    const created = {
      id: `worker-${Date.now()}`,
      name: payload.name.trim(),
      service: payload.service.trim(),
      location: payload.location.trim(),
      rating: payload.rating ?? 0,
      jobsDone: payload.jobsDone ?? 0,
      bio: payload.bio.trim(),
      experience: payload.experience.trim(),
      skills: payload.skills,
      phone: payload.phone.trim(),
      whatsapp: payload.whatsapp.trim(),
    };

    setWorkers((prev) => [created, ...prev]);
    return created;
  };

  const value = useMemo(
    () => ({
      workers,
      addWorker,
    }),
    [workers]
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
