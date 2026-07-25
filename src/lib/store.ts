import { useEffect, useState, useCallback } from "react";
import {
  initializeDbFn,
  getProfileFn,
  updateProfileFn,
  getCoursesFn,
  saveCourseFn,
  deleteCourseFn,
  getTodosFn,
  saveTodoFn,
  deleteTodoFn,
  getHabitsFn,
  saveHabitFn,
  deleteHabitFn,
} from "./dbServer";

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

export type CourseSchedule = {
  id: string;
  days: number[]; // 0=Mon..6=Sun
  start: string; // "HH:mm"
  end: string;   // "HH:mm"
};

export type CourseFile = {
  id: string;
  name: string;
  size: string;
  date: string;
};

export type Flashcard = {
  id: string;
  question: string;
  answer: string;
};

export type CourseStudySet = {
  id: string;
  title: string;
  cards: Flashcard[];
};

export type CourseLink = {
  id: string;
  title: string;
  url: string;
};

export type Course = {
  id: string;
  name: string;
  color: "orange" | "blue" | "gray" | "yellow" | "pink" | "green";
  instructor?: string;
  room?: string;
  schedules?: CourseSchedule[];
  files?: CourseFile[];
  studySets?: CourseStudySet[];
  links?: CourseLink[];
  // legacy fields, kept for older data
  day?: string;
  time?: string;
};

export type HabitFrequency = "daily" | "weekly" | "monthly" | "custom";

export type Habit = {
  id: string;
  name: string;
  icon: string;
  target: string;
  frequency: HabitFrequency;
  weekdays?: number[];
  time?: string;
  log: Record<string, boolean>;
};

export type Profile = {
  name: string;
  school: string;
  birthday: string;
  yearLevel: string;
};

let dbInitPromise: Promise<any> | null = null;

async function ensureDbInitialized() {
  if (!dbInitPromise) {
    dbInitPromise = initializeDbFn().catch((err) => {
      dbInitPromise = null;
      throw err;
    });
  }
  return dbInitPromise;
}

type Listener<T> = (val: T) => void;

class GlobalStore<T> {
  private state: T;
  private listeners = new Set<Listener<T>>();
  private fetchPromise: Promise<T> | null = null;
  private hasLoaded = false;

  constructor(
    private fallback: T,
    private fetchFn: () => Promise<T>,
    private saveFn: (val: T, prev: T) => Promise<void>
  ) {
    this.state = fallback;
  }

  getState() {
    return this.state;
  }

  async load() {
    if (this.hasLoaded) return this.state;
    if (!this.fetchPromise) {
      this.fetchPromise = (async () => {
        try {
          await ensureDbInitialized();
          const dbData = await this.fetchFn();
          if (dbData !== null && dbData !== undefined) {
            this.state = dbData;
            this.hasLoaded = true;
            this.notify();
          }
        } catch (err) {
          console.warn("Failed to load from DB:", err);
        }
        return this.state;
      })();
    }
    return this.fetchPromise;
  }

  isLoaded() {
    return this.hasLoaded;
  }

  setState(v: T | ((prev: T) => T)) {
    const prev = this.state;
    const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
    this.state = next;
    this.notify();

    this.saveFn(next, prev).catch((err) => {
      console.error("Failed to save to database:", err);
    });
  }

  reset() {
    this.state = this.fallback;
    this.hasLoaded = false;
    this.fetchPromise = null;
    this.notify();
  }

  subscribe(listener: Listener<T>) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.state));
  }
}

function useStoreInstance<T>(store: GlobalStore<T>) {
  const [state, setState] = useState<T>(store.getState());
  const [isLoading, setIsLoading] = useState(!store.isLoaded());

  useEffect(() => {
    const unsubscribe = store.subscribe((nextState) => {
      setState(nextState);
    });

    if (!store.isLoaded()) {
      setIsLoading(true);
      store.load().finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }

    return unsubscribe;
  }, [store]);

  const setAndSave = useCallback(
    (v: T | ((prev: T) => T)) => {
      store.setState(v);
    },
    [store]
  );

  return [state, setAndSave, isLoading] as const;
}

const defaultProfile: Profile = {
  name: "Student",
  school: "",
  birthday: "",
  yearLevel: "",
};

const defaultCourses: Course[] = [];

const defaultHabits: Habit[] = [];

const todosStore = new GlobalStore<Todo[]>([], getTodosFn, async (next, prev) => {
  const prevIds = new Set(prev.map(t => t.id));
  const nextIds = new Set(next.map(t => t.id));

  for (const t of next) {
    const prevItem = prev.find(p => p.id === t.id);
    if (!prevItem || JSON.stringify(prevItem) !== JSON.stringify(t)) {
      await saveTodoFn({ data: t });
    }
  }

  for (const id of prevIds) {
    if (!nextIds.has(id)) {
      await deleteTodoFn({ data: id });
    }
  }
});

const coursesStore = new GlobalStore<Course[]>(defaultCourses, getCoursesFn, async (next, prev) => {
  const prevIds = new Set(prev.map(c => c.id));
  const nextIds = new Set(next.map(c => c.id));

  for (const c of next) {
    const prevItem = prev.find(p => p.id === c.id);
    if (!prevItem || JSON.stringify(prevItem) !== JSON.stringify(c)) {
      await saveCourseFn({ data: c });
    }
  }

  for (const id of prevIds) {
    if (!nextIds.has(id)) {
      await deleteCourseFn({ data: id });
    }
  }
});

const habitsStore = new GlobalStore<Habit[]>(defaultHabits, getHabitsFn, async (next, prev) => {
  const prevIds = new Set(prev.map(h => h.id));
  const nextIds = new Set(next.map(h => h.id));

  for (const h of next) {
    const prevItem = prev.find(p => p.id === h.id);
    if (!prevItem || JSON.stringify(prevItem) !== JSON.stringify(h)) {
      await saveHabitFn({ data: h });
    }
  }

  for (const id of prevIds) {
    if (!nextIds.has(id)) {
      await deleteHabitFn({ data: id });
    }
  }
});

const profileStore = new GlobalStore<Profile>(defaultProfile, async () => {
  const p = await getProfileFn();
  return p ? {
    name: p.name,
    school: p.school,
    birthday: p.birthday,
    yearLevel: p.year_level,
  } : defaultProfile;
}, async (next) => {
  await updateProfileFn({ data: next });
});

export const useTodos = () => useStoreInstance(todosStore);
export const useCourses = () => useStoreInstance(coursesStore);
export const useHabits = () => useStoreInstance(habitsStore);
export const useProfile = () => useStoreInstance(profileStore);

export function resetAllStores() {
  todosStore.reset();
  coursesStore.reset();
  habitsStore.reset();
  profileStore.reset();
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export const fmtDate = (d = new Date()) =>
  d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

export const ymd = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const startOfWeek = (d = new Date()) => {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
