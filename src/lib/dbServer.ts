import { createServerFn } from "@tanstack/react-start";
import { getRequestIP, getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { auth } from "@clerk/tanstack-react-start/server";
import { sql, initializeDatabase } from "./db";
import { rateLimit } from "./rateLimit";

function getClientIp(): string {
  try {
    const ip = getRequestIP();
    if (ip) return ip;
  } catch {
    // Ignore when called outside server runtime (e.g. during build/prerender)
  }

  try {
    const req = getRequest();
    if (req) {
      const xForwardedFor = req.headers.get("x-forwarded-for");
      if (xForwardedFor) {
        return xForwardedFor.split(",")[0].trim();
      }
      const xRealIp = req.headers.get("x-real-ip");
      if (xRealIp) return xRealIp;
    }
  } catch {
    // Ignore
  }

  return "unknown-ip";
}

function enforceRateLimit(limit: number, windowMs: number) {
  const ip = getClientIp();
  if (ip === "unknown") return; // Skip if request context is not available
  const allowed = rateLimit(ip, limit, windowMs);
  if (!allowed) {
    throw new Error("Too many requests. Please try again later.");
  }
}

// Zod Schemas for Validation
const ProfileSchema = z.object({
  name: z.string(),
  school: z.string(),
  birthday: z.string(),
  yearLevel: z.string(),
});

const CourseScheduleSchema = z.object({
  id: z.string(),
  days: z.array(z.number()),
  start: z.string(),
  end: z.string(),
});

const CourseFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.string(),
  date: z.string(),
});

const FlashcardSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

const CourseStudySetSchema = z.object({
  id: z.string(),
  title: z.string(),
  cards: z.array(FlashcardSchema),
});

const CourseLinkSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
});

const CourseSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.enum(["orange", "blue", "gray", "yellow", "pink", "green"]),
  instructor: z.string().optional().nullable(),
  room: z.string().optional().nullable(),
  schedules: z.array(CourseScheduleSchema).optional().nullable(),
  files: z.array(CourseFileSchema).optional().nullable(),
  studySets: z.array(CourseStudySetSchema).optional().nullable(),
  links: z.array(CourseLinkSchema).optional().nullable(),
});

const TodoSubtaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  done: z.boolean(),
});

const TodoSchema = z.object({
  id: z.string(),
  title: z.string(),
  label: z.string(),
  courseId: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  subtasks: z.array(TodoSubtaskSchema),
  deadline: z.string().optional().nullable(),
  done: z.boolean(),
  createdAt: z.string(),
});

const HabitSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  target: z.string(),
  frequency: z.enum(["daily", "weekly", "monthly", "custom"]),
  weekdays: z.array(z.number()).optional().nullable(),
  time: z.string().optional().nullable(),
  log: z.record(z.string(), z.boolean()),
});

export const initializeDbFn = createServerFn({ method: "POST" }).handler(async () => {
  enforceRateLimit(10, 60 * 1000); // 10 requests per minute
  await initializeDatabase();
  return { success: true };
});

export const getProfileFn = createServerFn({ method: "GET" }).handler(async () => {
  if (!sql) return null;
  try {
    const { userId } = await auth();
    if (!userId) return null;
    const rows = await sql`SELECT * FROM profile WHERE id = ${userId}`;
    return rows[0] || null;
  } catch {
    return null;
  }
});

export const updateProfileFn = createServerFn({ method: "POST" })
  .validator((profile: unknown) => ProfileSchema.parse(profile))
  .handler(async ({ data: p }) => {
    enforceRateLimit(60, 60 * 1000); // 60 requests per minute
    if (!sql) return { success: false };
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    await sql`
      INSERT INTO profile (id, name, school, birthday, year_level)
      VALUES (${userId}, ${p.name}, ${p.school}, ${p.birthday}, ${p.yearLevel})
      ON CONFLICT (id) DO UPDATE
      SET name = EXCLUDED.name,
          school = EXCLUDED.school,
          birthday = EXCLUDED.birthday,
          year_level = EXCLUDED.year_level;
    `;
    return { success: true };
  });

export const getCoursesFn = createServerFn({ method: "GET" }).handler(async () => {
  if (!sql) return [];
  try {
    const { userId } = await auth();
    if (!userId) return [];
    const rows = await sql`SELECT * FROM courses WHERE user_id = ${userId}`;
    interface DbCourseRow {
      id: string;
      name: string;
      color: "orange" | "blue" | "gray" | "yellow" | "pink" | "green";
      instructor: string | null;
      room: string | null;
      schedules: unknown;
      files: unknown;
      study_sets: unknown;
      links: unknown;
    }
    return (rows as unknown as DbCourseRow[]).map((r) => ({
      id: r.id,
      name: r.name,
      color: r.color,
      instructor: r.instructor || undefined,
      room: r.room || undefined,
      schedules: (r.schedules as any[]) || [],
      files: (r.files as any[]) || [],
      studySets: (r.study_sets as any[]) || [],
      links: (r.links as any[]) || [],
    }));
  } catch {
    return [];
  }
});

export const saveCourseFn = createServerFn({ method: "POST" })
  .validator((course: unknown) => CourseSchema.parse(course))
  .handler(async ({ data: c }) => {
    enforceRateLimit(60, 60 * 1000);
    if (!sql) return { success: false };
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Verify ownership
    const existing = await sql`SELECT user_id FROM courses WHERE id = ${c.id}`;
    if (existing.length > 0 && existing[0].user_id !== userId) {
      throw new Error("Unauthorized");
    }

    await sql`
      INSERT INTO courses (id, user_id, name, color, instructor, room, schedules, files, study_sets, links)
      VALUES (${c.id}, ${userId}, ${c.name}, ${c.color}, ${c.instructor || null}, ${c.room || null}, 
              ${JSON.stringify(c.schedules || [])}, ${JSON.stringify(c.files || [])}, 
              ${JSON.stringify(c.studySets || [])}, ${JSON.stringify(c.links || [])})
      ON CONFLICT (id) DO UPDATE
      SET name = EXCLUDED.name,
          color = EXCLUDED.color,
          instructor = EXCLUDED.instructor,
          room = EXCLUDED.room,
          schedules = EXCLUDED.schedules,
          files = EXCLUDED.files,
          study_sets = EXCLUDED.study_sets,
          links = EXCLUDED.links;
    `;
    return { success: true };
  });

export const deleteCourseFn = createServerFn({ method: "POST" })
  .validator((id: unknown) => z.string().parse(id))
  .handler(async ({ data: id }) => {
    enforceRateLimit(60, 60 * 1000);
    if (!sql) return { success: false };
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Verify ownership
    const existing = await sql`SELECT user_id FROM courses WHERE id = ${id}`;
    if (existing.length > 0 && existing[0].user_id !== userId) {
      throw new Error("Unauthorized");
    }

    await sql`DELETE FROM courses WHERE id = ${id}`;
    return { success: true };
  });

export const getTodosFn = createServerFn({ method: "GET" }).handler(async () => {
  if (!sql) return [];
  try {
    const { userId } = await auth();
    if (!userId) return [];
    const rows = await sql`SELECT * FROM todos WHERE user_id = ${userId} ORDER BY created_at DESC`;
    interface DbTodoRow {
      id: string;
      title: string;
      label: string | null;
      course_id: string | null;
      description: string | null;
      subtasks: unknown;
      deadline: string | null;
      done: boolean;
      created_at: string;
    }
    return (rows as unknown as DbTodoRow[]).map((r) => ({
      id: r.id,
      title: r.title,
      label: r.label || undefined,
      courseId: r.course_id || undefined,
      description: r.description || undefined,
      subtasks: (r.subtasks as any[]) || [],
      deadline: r.deadline || undefined,
      done: r.done,
      createdAt: r.created_at,
    }));
  } catch {
    return [];
  }
});

export const saveTodoFn = createServerFn({ method: "POST" })
  .validator((todo: unknown) => TodoSchema.parse(todo))
  .handler(async ({ data: t }) => {
    enforceRateLimit(60, 60 * 1000);
    if (!sql) return { success: false };
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Verify ownership
    const existing = await sql`SELECT user_id FROM todos WHERE id = ${t.id}`;
    if (existing.length > 0 && existing[0].user_id !== userId) {
      throw new Error("Unauthorized");
    }

    await sql`
      INSERT INTO todos (id, user_id, title, label, course_id, description, subtasks, deadline, done, created_at)
      VALUES (${t.id}, ${userId}, ${t.title}, ${t.label || null}, ${t.courseId || null}, ${t.description || null}, 
              ${JSON.stringify(t.subtasks || [])}, ${t.deadline || null}, ${t.done}, ${t.createdAt})
      ON CONFLICT (id) DO UPDATE
      SET title = EXCLUDED.title,
          label = EXCLUDED.label,
          course_id = EXCLUDED.course_id,
          description = EXCLUDED.description,
          subtasks = EXCLUDED.subtasks,
          deadline = EXCLUDED.deadline,
          done = EXCLUDED.done,
          created_at = EXCLUDED.created_at;
    `;
    return { success: true };
  });

export const deleteTodoFn = createServerFn({ method: "POST" })
  .validator((id: unknown) => z.string().parse(id))
  .handler(async ({ data: id }) => {
    enforceRateLimit(60, 60 * 1000);
    if (!sql) return { success: false };
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Verify ownership
    const existing = await sql`SELECT user_id FROM todos WHERE id = ${id}`;
    if (existing.length > 0 && existing[0].user_id !== userId) {
      throw new Error("Unauthorized");
    }

    await sql`DELETE FROM todos WHERE id = ${id}`;
    return { success: true };
  });

export const getHabitsFn = createServerFn({ method: "GET" }).handler(async () => {
  if (!sql) return [];
  try {
    const { userId } = await auth();
    if (!userId) return [];
    const rows = await sql`SELECT * FROM habits WHERE user_id = ${userId}`;
    interface DbHabitRow {
      id: string;
      name: string;
      icon: string | null;
      target: string | null;
      frequency: "daily" | "weekly" | "monthly" | "custom";
      weekdays: unknown;
      time: string | null;
      log: unknown;
    }
    return (rows as unknown as DbHabitRow[]).map((r) => ({
      id: r.id,
      name: r.name,
      icon: r.icon || undefined,
      target: r.target || undefined,
      frequency: r.frequency,
      weekdays: (r.weekdays as any[]) || [],
      time: r.time || undefined,
      log: (r.log as Record<string, boolean>) || {},
    }));
  } catch {
    return [];
  }
});

export const saveHabitFn = createServerFn({ method: "POST" })
  .validator((habit: unknown) => HabitSchema.parse(habit))
  .handler(async ({ data: h }) => {
    enforceRateLimit(60, 60 * 1000);
    if (!sql) return { success: false };
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Verify ownership
    const existing = await sql`SELECT user_id FROM habits WHERE id = ${h.id}`;
    if (existing.length > 0 && existing[0].user_id !== userId) {
      throw new Error("Unauthorized");
    }

    await sql`
      INSERT INTO habits (id, user_id, name, icon, target, frequency, weekdays, time, log)
      VALUES (${h.id}, ${userId}, ${h.name}, ${h.icon || null}, ${h.target || null}, ${h.frequency}, 
              ${JSON.stringify(h.weekdays || [])}, ${h.time || null}, ${JSON.stringify(h.log || {})})
      ON CONFLICT (id) DO UPDATE
      SET name = EXCLUDED.name,
          icon = EXCLUDED.icon,
          target = EXCLUDED.target,
          frequency = EXCLUDED.frequency,
          weekdays = EXCLUDED.weekdays,
          time = EXCLUDED.time,
          log = EXCLUDED.log;
    `;
    return { success: true };
  });

export const deleteHabitFn = createServerFn({ method: "POST" })
  .validator((id: unknown) => z.string().parse(id))
  .handler(async ({ data: id }) => {
    enforceRateLimit(60, 60 * 1000);
    if (!sql) return { success: false };
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Verify ownership
    const existing = await sql`SELECT user_id FROM habits WHERE id = ${id}`;
    if (existing.length > 0 && existing[0].user_id !== userId) {
      throw new Error("Unauthorized");
    }

    await sql`DELETE FROM habits WHERE id = ${id}`;
    return { success: true };
  });

export const resetDbFn = createServerFn({ method: "POST" })
  .validator((data: { secret?: string }) => data)
  .handler(async ({ data }) => {
    enforceRateLimit(3, 10 * 60 * 1000); // 3 resets per 10 minutes
    const systemSecret = typeof process !== "undefined" ? process.env.RESET_DB_SECRET : undefined;
    if (systemSecret && data.secret !== systemSecret) {
      throw new Error("Unauthorized: Invalid reset secret");
    }
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    if (!sql) return { success: false };
    try {
      await sql`DELETE FROM profile WHERE id = ${userId}`;
      await sql`DELETE FROM courses WHERE user_id = ${userId}`;
      await sql`DELETE FROM todos WHERE user_id = ${userId}`;
      await sql`DELETE FROM habits WHERE user_id = ${userId}`;
      return { success: true };
    } catch (err) {
      console.error("Failed to reset database:", err);
      return { success: false };
    }
  });
