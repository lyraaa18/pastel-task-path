import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-Dp-V928M.mjs";
import { a as objectType, i as numberType, n as booleanType, o as recordType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import { n as getRequestIP, t as getRequest } from "./request-response-CP9bMnp0.mjs";
import { t as cs } from "../_libs/neondatabase__serverless.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dbServer-DHXFLB0B.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getDatabaseUrl = () => {
	if (typeof process !== "undefined" && process.env && process.env.DATABASE_URL) return process.env.DATABASE_URL;
	return "";
};
var databaseUrl = getDatabaseUrl();
var sql = databaseUrl ? cs(databaseUrl) : null;
async function initializeDatabase() {
	if (!sql) {
		console.warn("DATABASE_URL is not set. Skipping database initialization.");
		return;
	}
	try {
		await sql`
      CREATE TABLE IF NOT EXISTS profile (
        id VARCHAR(50) PRIMARY KEY,
        name TEXT NOT NULL,
        school TEXT,
        birthday TEXT,
        year_level TEXT
      );
    `;
		await sql`
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(50) PRIMARY KEY,
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
		await sql`
      CREATE TABLE IF NOT EXISTS todos (
        id VARCHAR(50) PRIMARY KEY,
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
		await sql`
      CREATE TABLE IF NOT EXISTS habits (
        id VARCHAR(50) PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        target TEXT,
        frequency VARCHAR(20),
        weekdays JSONB,
        time TEXT,
        log JSONB
      );
    `;
		console.log("Database tables checked/created successfully.");
	} catch (error) {
		console.error("Failed to initialize database:", error);
	}
}
var rateLimitMap = /* @__PURE__ */ new Map();
/**
* Checks if a request from a given IP is allowed under the rate limit.
*
* @param ip The client's IP address
* @param limit The maximum number of allowed requests in the window
* @param windowMs The duration of the sliding window in milliseconds
* @returns boolean true if the request is allowed, false if it is rate-limited
*/
function rateLimit(ip, limit, windowMs) {
	const now = Date.now();
	const record = rateLimitMap.get(ip);
	if (!record) {
		rateLimitMap.set(ip, {
			count: 1,
			resetTime: now + windowMs
		});
		return true;
	}
	if (now > record.resetTime) {
		record.count = 1;
		record.resetTime = now + windowMs;
		return true;
	}
	if (record.count >= limit) return false;
	record.count++;
	return true;
}
function getClientIp() {
	try {
		const ip = getRequestIP();
		if (ip) return ip;
	} catch {}
	try {
		const req = getRequest();
		if (req) {
			const xForwardedFor = req.headers.get("x-forwarded-for");
			if (xForwardedFor) return xForwardedFor.split(",")[0].trim();
			const xRealIp = req.headers.get("x-real-ip");
			if (xRealIp) return xRealIp;
		}
	} catch {}
	return "unknown-ip";
}
function enforceRateLimit(limit, windowMs) {
	const ip = getClientIp();
	if (ip === "unknown") return;
	if (!rateLimit(ip, limit, windowMs)) throw new Error("Too many requests. Please try again later.");
}
var ProfileSchema = objectType({
	name: stringType(),
	school: stringType(),
	birthday: stringType(),
	yearLevel: stringType()
});
var CourseScheduleSchema = objectType({
	id: stringType(),
	days: arrayType(numberType()),
	start: stringType(),
	end: stringType()
});
var CourseFileSchema = objectType({
	id: stringType(),
	name: stringType(),
	size: stringType(),
	date: stringType()
});
var FlashcardSchema = objectType({
	id: stringType(),
	question: stringType(),
	answer: stringType()
});
var CourseStudySetSchema = objectType({
	id: stringType(),
	title: stringType(),
	cards: arrayType(FlashcardSchema)
});
var CourseLinkSchema = objectType({
	id: stringType(),
	title: stringType(),
	url: stringType()
});
var CourseSchema = objectType({
	id: stringType(),
	name: stringType(),
	color: enumType([
		"orange",
		"blue",
		"gray",
		"yellow",
		"pink",
		"green"
	]),
	instructor: stringType().optional().nullable(),
	room: stringType().optional().nullable(),
	schedules: arrayType(CourseScheduleSchema).optional().nullable(),
	files: arrayType(CourseFileSchema).optional().nullable(),
	studySets: arrayType(CourseStudySetSchema).optional().nullable(),
	links: arrayType(CourseLinkSchema).optional().nullable()
});
var TodoSubtaskSchema = objectType({
	id: stringType(),
	title: stringType(),
	done: booleanType()
});
var TodoSchema = objectType({
	id: stringType(),
	title: stringType(),
	label: stringType(),
	courseId: stringType().optional().nullable(),
	description: stringType().optional().nullable(),
	subtasks: arrayType(TodoSubtaskSchema),
	deadline: stringType().optional().nullable(),
	done: booleanType(),
	createdAt: stringType()
});
var HabitSchema = objectType({
	id: stringType(),
	name: stringType(),
	icon: stringType(),
	target: stringType(),
	frequency: enumType([
		"daily",
		"weekly",
		"monthly",
		"custom"
	]),
	weekdays: arrayType(numberType()).optional().nullable(),
	time: stringType().optional().nullable(),
	log: recordType(stringType(), booleanType())
});
var initializeDbFn_createServerFn_handler = createServerRpc({
	id: "ee85124d4e1daab50938ada6296c8513e4fecd1b9e5e4753afa2f6e40c342a2f",
	name: "initializeDbFn",
	filename: "src/lib/dbServer.ts"
}, (opts) => initializeDbFn.__executeServer(opts));
var initializeDbFn = createServerFn({ method: "POST" }).handler(initializeDbFn_createServerFn_handler, async () => {
	enforceRateLimit(10, 60 * 1e3);
	await initializeDatabase();
	return { success: true };
});
var getProfileFn_createServerFn_handler = createServerRpc({
	id: "0ccebc738b43d541be6b638c66d210db6c790260995b4ba2c794a83249f872d1",
	name: "getProfileFn",
	filename: "src/lib/dbServer.ts"
}, (opts) => getProfileFn.__executeServer(opts));
var getProfileFn = createServerFn({ method: "GET" }).handler(getProfileFn_createServerFn_handler, async () => {
	if (!sql) return null;
	try {
		return (await sql`SELECT * FROM profile LIMIT 1`)[0] || null;
	} catch {
		return null;
	}
});
var updateProfileFn_createServerFn_handler = createServerRpc({
	id: "a72cb693c1304fa60245833860aef27b04a41a851bcaeb025686cec6944d31c5",
	name: "updateProfileFn",
	filename: "src/lib/dbServer.ts"
}, (opts) => updateProfileFn.__executeServer(opts));
var updateProfileFn = createServerFn({ method: "POST" }).validator((profile) => ProfileSchema.parse(profile)).handler(updateProfileFn_createServerFn_handler, async ({ data: p }) => {
	enforceRateLimit(60, 60 * 1e3);
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
var getCoursesFn_createServerFn_handler = createServerRpc({
	id: "048541e9910caa4f1ecf2c5917c1beb1f53221dc270e382994e93ea973da9da5",
	name: "getCoursesFn",
	filename: "src/lib/dbServer.ts"
}, (opts) => getCoursesFn.__executeServer(opts));
var getCoursesFn = createServerFn({ method: "GET" }).handler(getCoursesFn_createServerFn_handler, async () => {
	if (!sql) return [];
	try {
		return (await sql`SELECT * FROM courses`).map((r) => ({
			id: r.id,
			name: r.name,
			color: r.color,
			instructor: r.instructor || void 0,
			room: r.room || void 0,
			schedules: r.schedules || [],
			files: r.files || [],
			studySets: r.study_sets || [],
			links: r.links || []
		}));
	} catch {
		return [];
	}
});
var saveCourseFn_createServerFn_handler = createServerRpc({
	id: "0de0d7df5130f25542a48510744f779f573045a5b25b313e741f28410748b155",
	name: "saveCourseFn",
	filename: "src/lib/dbServer.ts"
}, (opts) => saveCourseFn.__executeServer(opts));
var saveCourseFn = createServerFn({ method: "POST" }).validator((course) => CourseSchema.parse(course)).handler(saveCourseFn_createServerFn_handler, async ({ data: c }) => {
	enforceRateLimit(60, 60 * 1e3);
	if (!sql) return { success: false };
	await sql`
      INSERT INTO courses (id, name, color, instructor, room, schedules, files, study_sets, links)
      VALUES (${c.id}, ${c.name}, ${c.color}, ${c.instructor || null}, ${c.room || null}, 
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
var deleteCourseFn_createServerFn_handler = createServerRpc({
	id: "d6213460df8a49fadf6ac51b5d2e4d02fe89274c1f9c8ad7cce5eb34f923343e",
	name: "deleteCourseFn",
	filename: "src/lib/dbServer.ts"
}, (opts) => deleteCourseFn.__executeServer(opts));
var deleteCourseFn = createServerFn({ method: "POST" }).validator((id) => stringType().parse(id)).handler(deleteCourseFn_createServerFn_handler, async ({ data: id }) => {
	enforceRateLimit(60, 60 * 1e3);
	if (!sql) return { success: false };
	await sql`DELETE FROM courses WHERE id = ${id}`;
	return { success: true };
});
var getTodosFn_createServerFn_handler = createServerRpc({
	id: "6103ee6140587c709da7416f450babc9207f7abeea0699c990d4781f3be83bb7",
	name: "getTodosFn",
	filename: "src/lib/dbServer.ts"
}, (opts) => getTodosFn.__executeServer(opts));
var getTodosFn = createServerFn({ method: "GET" }).handler(getTodosFn_createServerFn_handler, async () => {
	if (!sql) return [];
	try {
		return (await sql`SELECT * FROM todos ORDER BY created_at DESC`).map((r) => ({
			id: r.id,
			title: r.title,
			label: r.label || void 0,
			courseId: r.course_id || void 0,
			description: r.description || void 0,
			subtasks: r.subtasks || [],
			deadline: r.deadline || void 0,
			done: r.done,
			createdAt: r.created_at
		}));
	} catch {
		return [];
	}
});
var saveTodoFn_createServerFn_handler = createServerRpc({
	id: "d66e575b718c940fa5dbfbccc7fc7464be405fd31e6d1360f94c9e55dc7f7c00",
	name: "saveTodoFn",
	filename: "src/lib/dbServer.ts"
}, (opts) => saveTodoFn.__executeServer(opts));
var saveTodoFn = createServerFn({ method: "POST" }).validator((todo) => TodoSchema.parse(todo)).handler(saveTodoFn_createServerFn_handler, async ({ data: t }) => {
	enforceRateLimit(60, 60 * 1e3);
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
var deleteTodoFn_createServerFn_handler = createServerRpc({
	id: "2ebe43bb67dd39173f48a28f03137ea783f7b2f12d4c7ff8414037a7c0e4e5df",
	name: "deleteTodoFn",
	filename: "src/lib/dbServer.ts"
}, (opts) => deleteTodoFn.__executeServer(opts));
var deleteTodoFn = createServerFn({ method: "POST" }).validator((id) => stringType().parse(id)).handler(deleteTodoFn_createServerFn_handler, async ({ data: id }) => {
	enforceRateLimit(60, 60 * 1e3);
	if (!sql) return { success: false };
	await sql`DELETE FROM todos WHERE id = ${id}`;
	return { success: true };
});
var getHabitsFn_createServerFn_handler = createServerRpc({
	id: "ebcf708171b20f8f0252eed5a6293a329055c5ee9b6484c634200deb23dfa1ae",
	name: "getHabitsFn",
	filename: "src/lib/dbServer.ts"
}, (opts) => getHabitsFn.__executeServer(opts));
var getHabitsFn = createServerFn({ method: "GET" }).handler(getHabitsFn_createServerFn_handler, async () => {
	if (!sql) return [];
	try {
		return (await sql`SELECT * FROM habits`).map((r) => ({
			id: r.id,
			name: r.name,
			icon: r.icon || void 0,
			target: r.target || void 0,
			frequency: r.frequency,
			weekdays: r.weekdays || [],
			time: r.time || void 0,
			log: r.log || {}
		}));
	} catch {
		return [];
	}
});
var saveHabitFn_createServerFn_handler = createServerRpc({
	id: "2675f3fa48d16aaf637628d2bfdcc95947befe4683edaf6e9cf3c9d06dd402f5",
	name: "saveHabitFn",
	filename: "src/lib/dbServer.ts"
}, (opts) => saveHabitFn.__executeServer(opts));
var saveHabitFn = createServerFn({ method: "POST" }).validator((habit) => HabitSchema.parse(habit)).handler(saveHabitFn_createServerFn_handler, async ({ data: h }) => {
	enforceRateLimit(60, 60 * 1e3);
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
var deleteHabitFn_createServerFn_handler = createServerRpc({
	id: "04c8fb39ce8cd1bac608f72bb048fe51b20e4d45d17d65eb0d33e58d78c38f83",
	name: "deleteHabitFn",
	filename: "src/lib/dbServer.ts"
}, (opts) => deleteHabitFn.__executeServer(opts));
var deleteHabitFn = createServerFn({ method: "POST" }).validator((id) => stringType().parse(id)).handler(deleteHabitFn_createServerFn_handler, async ({ data: id }) => {
	enforceRateLimit(60, 60 * 1e3);
	if (!sql) return { success: false };
	await sql`DELETE FROM habits WHERE id = ${id}`;
	return { success: true };
});
var resetDbFn_createServerFn_handler = createServerRpc({
	id: "31106b17cb2344efb31199a3728f9988ff394653ceff344ddb422fc9e4ab72dd",
	name: "resetDbFn",
	filename: "src/lib/dbServer.ts"
}, (opts) => resetDbFn.__executeServer(opts));
var resetDbFn = createServerFn({ method: "POST" }).validator((data) => data).handler(resetDbFn_createServerFn_handler, async ({ data }) => {
	enforceRateLimit(3, 600 * 1e3);
	const systemSecret = typeof process !== "undefined" ? process.env.RESET_DB_SECRET : void 0;
	if (systemSecret && data.secret !== systemSecret) throw new Error("Unauthorized: Invalid reset secret");
	if (!sql) return { success: false };
	try {
		await sql`TRUNCATE TABLE profile, courses, todos, habits RESTART IDENTITY`;
		return { success: true };
	} catch (err) {
		console.error("Failed to reset database:", err);
		return { success: false };
	}
});
//#endregion
export { deleteCourseFn_createServerFn_handler, deleteHabitFn_createServerFn_handler, deleteTodoFn_createServerFn_handler, getCoursesFn_createServerFn_handler, getHabitsFn_createServerFn_handler, getProfileFn_createServerFn_handler, getTodosFn_createServerFn_handler, initializeDbFn_createServerFn_handler, resetDbFn_createServerFn_handler, saveCourseFn_createServerFn_handler, saveHabitFn_createServerFn_handler, saveTodoFn_createServerFn_handler, updateProfileFn_createServerFn_handler };
