import { createServerFn } from "@tanstack/react-start";
import { sql, initializeDatabase } from "./db";

export const initializeDbFn = createServerFn({ method: "POST" })
  .handler(async () => {
    await initializeDatabase();
    return { success: true };
  });

export const getProfileFn = createServerFn({ method: "GET" })
  .handler(async () => {
    if (!sql) return null;
    try {
      const rows = await sql`SELECT * FROM profile LIMIT 1`;
      return rows[0] || null;
    } catch {
      return null;
    }
  });

export const updateProfileFn = createServerFn({ method: "POST" })
  .validator((profile: any) => profile)
  .handler(async ({ data: p }) => {
    if (!sql) return { success: false };
    await sql`
      INSERT INTO profile (id, name, school, birthday, year_level)
      VALUES ('user', ${p.name}, ${p.school}, ${p.birthday}, ${p.yearLevel})
      ON CONFLICT (id) DO UPDATE
      SET name = EXCLUDED.name,
          school = EXCLUDED.school,
          birthday = EXCLUDED.birthday,
          year_level = EXCLUDED.year_level;
    `;
    return { success: true };
  });

export const getCoursesFn = createServerFn({ method: "GET" })
  .handler(async () => {
    if (!sql) return [];
    try {
      const rows = await sql`SELECT * FROM courses`;
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        color: r.color,
        instructor: r.instructor || undefined,
        room: r.room || undefined,
        schedules: r.schedules || [],
        files: r.files || [],
        studySets: r.study_sets || [],
        links: r.links || [],
        day: r.day || undefined,
        time: r.time || undefined,
      }));
    } catch {
      return [];
    }
  });

export const saveCourseFn = createServerFn({ method: "POST" })
  .validator((course: any) => course)
  .handler(async ({ data: c }) => {
    if (!sql) return { success: false };
    await sql`
      INSERT INTO courses (id, name, color, instructor, room, schedules, files, study_sets, links, day, time)
      VALUES (${c.id}, ${c.name}, ${c.color}, ${c.instructor || null}, ${c.room || null}, 
              ${JSON.stringify(c.schedules || [])}, ${JSON.stringify(c.files || [])}, 
              ${JSON.stringify(c.studySets || [])}, ${JSON.stringify(c.links || [])}, 
              ${c.day || null}, ${c.time || null})
      ON CONFLICT (id) DO UPDATE
      SET name = EXCLUDED.name,
          color = EXCLUDED.color,
          instructor = EXCLUDED.instructor,
          room = EXCLUDED.room,
          schedules = EXCLUDED.schedules,
          files = EXCLUDED.files,
          study_sets = EXCLUDED.study_sets,
          links = EXCLUDED.links,
          day = EXCLUDED.day,
          time = EXCLUDED.time;
    `;
    return { success: true };
  });

export const deleteCourseFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    if (!sql) return { success: false };
    await sql`DELETE FROM courses WHERE id = ${id}`;
    return { success: true };
  });

export const getTodosFn = createServerFn({ method: "GET" })
  .handler(async () => {
    if (!sql) return [];
    try {
      const rows = await sql`SELECT * FROM todos ORDER BY created_at DESC`;
      return rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        label: r.label || undefined,
        courseId: r.course_id || undefined,
        description: r.description || undefined,
        subtasks: r.subtasks || [],
        deadline: r.deadline || undefined,
        done: r.done,
        createdAt: r.created_at,
      }));
    } catch {
      return [];
    }
  });

export const saveTodoFn = createServerFn({ method: "POST" })
  .validator((todo: any) => todo)
  .handler(async ({ data: t }) => {
    if (!sql) return { success: false };
    await sql`
      INSERT INTO todos (id, title, label, course_id, description, subtasks, deadline, done, created_at)
      VALUES (${t.id}, ${t.title}, ${t.label || null}, ${t.courseId || null}, ${t.description || null}, 
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
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    if (!sql) return { success: false };
    await sql`DELETE FROM todos WHERE id = ${id}`;
    return { success: true };
  });

export const getHabitsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    if (!sql) return [];
    try {
      const rows = await sql`SELECT * FROM habits`;
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        icon: r.icon || undefined,
        target: r.target || undefined,
        frequency: r.frequency,
        weekdays: r.weekdays || [],
        time: r.time || undefined,
        log: r.log || {},
      }));
    } catch {
      return [];
    }
  });

export const saveHabitFn = createServerFn({ method: "POST" })
  .validator((habit: any) => habit)
  .handler(async ({ data: h }) => {
    if (!sql) return { success: false };
    await sql`
      INSERT INTO habits (id, name, icon, target, frequency, weekdays, time, log)
      VALUES (${h.id}, ${h.name}, ${h.icon || null}, ${h.target || null}, ${h.frequency}, 
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
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    if (!sql) return { success: false };
    await sql`DELETE FROM habits WHERE id = ${id}`;
    return { success: true };
  });

export const resetDbFn = createServerFn({ method: "POST" })
  .handler(async () => {
    if (!sql) return { success: false };
    try {
      await sql`TRUNCATE TABLE profile, courses, todos, habits RESTART IDENTITY`;
      return { success: true };
    } catch (err) {
      console.error("Failed to reset database:", err);
      return { success: false };
    }
  });
