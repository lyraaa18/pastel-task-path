import { neon } from "@neondatabase/serverless";

const getDatabaseUrl = () => {
  if (typeof process !== "undefined" && process.env && process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  // @ts-expect-error
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DATABASE_URL) {
    // @ts-expect-error
    return import.meta.env.DATABASE_URL;
  }
  return "";
};

const databaseUrl = getDatabaseUrl();

export const sql = databaseUrl ? neon(databaseUrl) : null;

export async function initializeDatabase() {
  if (!sql) {
    console.warn("DATABASE_URL is not set. Skipping database initialization.");
    return;
  }

  try {
    // Create Profile Table
    await sql`
      CREATE TABLE IF NOT EXISTS profile (
        id VARCHAR(50) PRIMARY KEY,
        name TEXT NOT NULL,
        school TEXT,
        birthday TEXT,
        year_level TEXT
      );
    `;

    // Create Courses Table
    await sql`
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(100),
        name TEXT NOT NULL,
        color VARCHAR(20) NOT NULL,
        instructor TEXT,
        room TEXT,
        schedules JSONB,
        files JSONB,
        study_sets JSONB,
        links JSONB
      );
    `;
    await sql`ALTER TABLE courses ADD COLUMN IF NOT EXISTS user_id VARCHAR(100);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_courses_user_id ON courses(user_id);`;

    // Create Todos Table
    await sql`
      CREATE TABLE IF NOT EXISTS todos (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(100),
        title TEXT NOT NULL,
        label TEXT,
        course_id VARCHAR(50),
        description TEXT,
        subtasks JSONB,
        deadline TEXT,
        done BOOLEAN DEFAULT FALSE,
        created_at TEXT
      );
    `;
    await sql`ALTER TABLE todos ADD COLUMN IF NOT EXISTS user_id VARCHAR(100);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);`;

    // Create Habits Table
    await sql`
      CREATE TABLE IF NOT EXISTS habits (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(100),
        name TEXT NOT NULL,
        icon TEXT,
        target TEXT,
        frequency VARCHAR(20),
        weekdays JSONB,
        time TEXT,
        log JSONB
      );
    `;
    await sql`ALTER TABLE habits ADD COLUMN IF NOT EXISTS user_id VARCHAR(100);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);`;

    console.log("Database tables checked/created successfully.");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}
