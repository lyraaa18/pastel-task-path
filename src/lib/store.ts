import { useEffect, useState, useCallback } from "react";

export type Todo = {
  id: string;
  title: string;
  label: string; // "Custom" or course id
  courseId?: string;
  description?: string;
  subtasks: { id: string; title: string; done: boolean }[];
  deadline?: string; // ISO
  done: boolean;
  createdAt: string;
};

export type Course = {
  id: string;
  name: string;
  color: "orange" | "blue" | "gray" | "yellow" | "pink" | "green";
  instructor?: string;
  day?: string;
  time?: string;
  room?: string;
};

export type HabitFrequency = "daily" | "weekly" | "monthly" | "custom";

export type Habit = {
  id: string;
  name: string;
  icon: string; // emoji or key
  target: string; // e.g. "8 glass"
  frequency: HabitFrequency;
  weekdays?: number[]; // 0=Sun..6=Sat, for custom
  time?: string; // optional "HH:mm"
  // daily completion: map date(YYYY-MM-DD) -> boolean
  log: Record<string, boolean>;
};

const KEYS = {
  todos: "spa.todos",
  courses: "spa.courses",
  habits: "spa.habits",
  profile: "spa.profile",
};

export type Profile = {
  name: string;
  school: string;
  birthday: string;
  yearLevel: string;
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new StorageEvent("storage", { key }));
}

function useStored<T>(key: string, fallback: T) {
  const [state, setState] = useState<T>(fallback);
  useEffect(() => {
    setState(read(key, fallback));
    const onChange = (e: StorageEvent) => {
      if (!e.key || e.key === key) setState(read(key, fallback));
    };
    window.addEventListener("storage", onChange);
    return () => window.removeEventListener("storage", onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const setAndWrite = useCallback(
    (v: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        write(key, next);
        return next;
      });
    },
    [key]
  );
  return [state, setAndWrite] as const;
}

const defaultProfile: Profile = {
  name: "Chaemdara",
  school: "KU",
  birthday: "19-04-2002",
  yearLevel: "<3 Electric",
};

const defaultCourses: Course[] = [
  { id: "c1", name: "Analisa Malware", color: "orange", instructor: "Mr. J", day: "TUE", time: "14:39 - 15:39", room: "K" },
  { id: "c2", name: "Blockchain", color: "blue", instructor: "Mrs. A", day: "WED", time: "10:00 - 11:30", room: "B2" },
  { id: "c3", name: "Bootcamp", color: "gray", instructor: "Mr. K", day: "FRI", time: "09:00 - 12:00", room: "Lab" },
];

const defaultHabits: Habit[] = [
  { id: "h1", name: "Drink Water", icon: "💧", target: "8 glass", log: {} },
  { id: "h2", name: "Study 1 Hour", icon: "📖", target: "Focus time", log: {} },
  { id: "h3", name: "Exercise", icon: "🏋️", target: "30 minutes", log: {} },
  { id: "h4", name: "Read", icon: "📚", target: "10 pages", log: {} },
];

export const useTodos = () => useStored<Todo[]>(KEYS.todos, []);
export const useCourses = () => useStored<Course[]>(KEYS.courses, defaultCourses);
export const useHabits = () => useStored<Habit[]>(KEYS.habits, defaultHabits);
export const useProfile = () => useStored<Profile>(KEYS.profile, defaultProfile);

export const uid = () => Math.random().toString(36).slice(2, 10);

export const fmtDate = (d = new Date()) =>
  d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

export const ymd = (d = new Date()) => d.toISOString().slice(0, 10);

export const startOfWeek = (d = new Date()) => {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Mon=0
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
};
