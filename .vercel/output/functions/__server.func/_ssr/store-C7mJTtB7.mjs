import { r as __toESM } from "../_runtime.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-Dp-V928M.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-D764ZhV5.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as useRouterState, f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as objectType, i as numberType, n as booleanType, o as recordType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import { C as CalendarDays, _ as Clock, h as FolderClosed, m as House, s as Settings, w as Activity } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-C7mJTtB7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var tabs = [
	{
		to: "/",
		label: "Home",
		icon: House
	},
	{
		to: "/courses",
		label: "Courses",
		icon: FolderClosed
	},
	{
		to: "/calendar",
		label: "Calendar",
		icon: CalendarDays
	},
	{
		to: "/schedule",
		label: "Schedule",
		icon: Clock
	},
	{
		to: "/habits",
		label: "Habits",
		icon: Activity
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings
	}
];
function MobileShell({ children, isLoading }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen w-full bg-background flex justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-[440px] min-h-screen bg-background relative pb-24",
			children: [isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center min-h-[80vh] px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-16 h-16",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-full bg-pastel-yellow/40 animate-ping" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-2 rounded-full bg-pastel-blue/60 animate-pulse" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-4 rounded-full bg-pastel-green/80 flex items-center justify-center text-sm",
							children: "🎓"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs font-serif italic text-muted-foreground animate-pulse",
					children: "Loading database..."
				})]
			}) : children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {})]
		})
	});
}
function BottomNav() {
	const path = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-card/95 backdrop-blur border-t border-border z-40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid grid-cols-6 px-2 py-2",
			children: tabs.map(({ to, label, icon: Icon }) => {
				const active = to === "/" ? path === "/" : path.startsWith(to);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to,
					className: "flex flex-col items-center gap-0.5 py-1.5 text-[10px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						className: "w-5 h-5 transition " + (active ? "text-foreground" : "text-muted-foreground"),
						strokeWidth: active ? 2.2 : 1.6,
						fill: active && (label === "Courses" || label === "Habits") ? "var(--pastel-yellow)" : "none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: active ? "text-foreground font-medium" : "text-muted-foreground",
						children: label
					})]
				}) }, to);
			})
		})
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
var initializeDbFn = createServerFn({ method: "POST" }).handler(createSsrRpc("ee85124d4e1daab50938ada6296c8513e4fecd1b9e5e4753afa2f6e40c342a2f"));
var getProfileFn = createServerFn({ method: "GET" }).handler(createSsrRpc("0ccebc738b43d541be6b638c66d210db6c790260995b4ba2c794a83249f872d1"));
var updateProfileFn = createServerFn({ method: "POST" }).validator((profile) => ProfileSchema.parse(profile)).handler(createSsrRpc("a72cb693c1304fa60245833860aef27b04a41a851bcaeb025686cec6944d31c5"));
var getCoursesFn = createServerFn({ method: "GET" }).handler(createSsrRpc("048541e9910caa4f1ecf2c5917c1beb1f53221dc270e382994e93ea973da9da5"));
var saveCourseFn = createServerFn({ method: "POST" }).validator((course) => CourseSchema.parse(course)).handler(createSsrRpc("0de0d7df5130f25542a48510744f779f573045a5b25b313e741f28410748b155"));
var deleteCourseFn = createServerFn({ method: "POST" }).validator((id) => stringType().parse(id)).handler(createSsrRpc("d6213460df8a49fadf6ac51b5d2e4d02fe89274c1f9c8ad7cce5eb34f923343e"));
var getTodosFn = createServerFn({ method: "GET" }).handler(createSsrRpc("6103ee6140587c709da7416f450babc9207f7abeea0699c990d4781f3be83bb7"));
var saveTodoFn = createServerFn({ method: "POST" }).validator((todo) => TodoSchema.parse(todo)).handler(createSsrRpc("d66e575b718c940fa5dbfbccc7fc7464be405fd31e6d1360f94c9e55dc7f7c00"));
var deleteTodoFn = createServerFn({ method: "POST" }).validator((id) => stringType().parse(id)).handler(createSsrRpc("2ebe43bb67dd39173f48a28f03137ea783f7b2f12d4c7ff8414037a7c0e4e5df"));
var getHabitsFn = createServerFn({ method: "GET" }).handler(createSsrRpc("ebcf708171b20f8f0252eed5a6293a329055c5ee9b6484c634200deb23dfa1ae"));
var saveHabitFn = createServerFn({ method: "POST" }).validator((habit) => HabitSchema.parse(habit)).handler(createSsrRpc("2675f3fa48d16aaf637628d2bfdcc95947befe4683edaf6e9cf3c9d06dd402f5"));
var deleteHabitFn = createServerFn({ method: "POST" }).validator((id) => stringType().parse(id)).handler(createSsrRpc("04c8fb39ce8cd1bac608f72bb048fe51b20e4d45d17d65eb0d33e58d78c38f83"));
var resetDbFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("31106b17cb2344efb31199a3728f9988ff394653ceff344ddb422fc9e4ab72dd"));
var dbInitPromise = null;
async function ensureDbInitialized() {
	if (!dbInitPromise) dbInitPromise = initializeDbFn().catch((err) => {
		dbInitPromise = null;
		throw err;
	});
	return dbInitPromise;
}
var GlobalStore = class {
	fallback;
	fetchFn;
	saveFn;
	state;
	listeners = /* @__PURE__ */ new Set();
	fetchPromise = null;
	hasLoaded = false;
	constructor(fallback, fetchFn, saveFn) {
		this.fallback = fallback;
		this.fetchFn = fetchFn;
		this.saveFn = saveFn;
		this.state = fallback;
	}
	getState() {
		return this.state;
	}
	async load() {
		if (this.hasLoaded) return this.state;
		if (!this.fetchPromise) this.fetchPromise = (async () => {
			try {
				await ensureDbInitialized();
				const dbData = await this.fetchFn();
				if (dbData !== null && dbData !== void 0) {
					this.state = dbData;
					this.hasLoaded = true;
					this.notify();
				}
			} catch (err) {
				console.warn("Failed to load from DB:", err);
			}
			return this.state;
		})();
		return this.fetchPromise;
	}
	isLoaded() {
		return this.hasLoaded;
	}
	setState(v) {
		const prev = this.state;
		const next = typeof v === "function" ? v(prev) : v;
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
	subscribe(listener) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}
	notify() {
		this.listeners.forEach((l) => l(this.state));
	}
};
function useStoreInstance(store) {
	const [state, setState] = (0, import_react.useState)(store.getState());
	const [isLoading, setIsLoading] = (0, import_react.useState)(!store.isLoaded());
	(0, import_react.useEffect)(() => {
		const unsubscribe = store.subscribe((nextState) => {
			setState(nextState);
		});
		if (!store.isLoaded()) {
			setIsLoading(true);
			store.load().finally(() => {
				setIsLoading(false);
			});
		} else setIsLoading(false);
		return unsubscribe;
	}, [store]);
	return [
		state,
		(0, import_react.useCallback)((v) => {
			store.setState(v);
		}, [store]),
		isLoading
	];
}
var defaultProfile = {
	name: "Student",
	school: "",
	birthday: "",
	yearLevel: ""
};
var defaultCourses = [];
var defaultHabits = [];
var todosStore = new GlobalStore([], getTodosFn, async (next, prev) => {
	const prevIds = new Set(prev.map((t) => t.id));
	const nextIds = new Set(next.map((t) => t.id));
	for (const t of next) {
		const prevItem = prev.find((p) => p.id === t.id);
		if (!prevItem || JSON.stringify(prevItem) !== JSON.stringify(t)) await saveTodoFn({ data: t });
	}
	for (const id of prevIds) if (!nextIds.has(id)) await deleteTodoFn({ data: id });
});
var coursesStore = new GlobalStore(defaultCourses, getCoursesFn, async (next, prev) => {
	const prevIds = new Set(prev.map((c) => c.id));
	const nextIds = new Set(next.map((c) => c.id));
	for (const c of next) {
		const prevItem = prev.find((p) => p.id === c.id);
		if (!prevItem || JSON.stringify(prevItem) !== JSON.stringify(c)) await saveCourseFn({ data: c });
	}
	for (const id of prevIds) if (!nextIds.has(id)) await deleteCourseFn({ data: id });
});
var habitsStore = new GlobalStore(defaultHabits, getHabitsFn, async (next, prev) => {
	const prevIds = new Set(prev.map((h) => h.id));
	const nextIds = new Set(next.map((h) => h.id));
	for (const h of next) {
		const prevItem = prev.find((p) => p.id === h.id);
		if (!prevItem || JSON.stringify(prevItem) !== JSON.stringify(h)) await saveHabitFn({ data: h });
	}
	for (const id of prevIds) if (!nextIds.has(id)) await deleteHabitFn({ data: id });
});
var profileStore = new GlobalStore(defaultProfile, async () => {
	const p = await getProfileFn();
	return p ? {
		name: p.name,
		school: p.school,
		birthday: p.birthday,
		yearLevel: p.year_level
	} : defaultProfile;
}, async (next) => {
	await updateProfileFn({ data: next });
});
var useTodos = () => useStoreInstance(todosStore);
var useCourses = () => useStoreInstance(coursesStore);
var useHabits = () => useStoreInstance(habitsStore);
var useProfile = () => useStoreInstance(profileStore);
function resetAllStores() {
	todosStore.reset();
	coursesStore.reset();
	habitsStore.reset();
	profileStore.reset();
}
var uid = () => {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
	return Math.random().toString(36).slice(2, 10);
};
var ymd = (d = /* @__PURE__ */ new Date()) => {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
var startOfWeek = (d = /* @__PURE__ */ new Date()) => {
	const x = new Date(d);
	const day = (x.getDay() + 6) % 7;
	x.setDate(x.getDate() - day);
	x.setHours(0, 0, 0, 0);
	return x;
};
var DAY_LABELS = [
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun"
];
//#endregion
export { startOfWeek as a, useHabits as c, ymd as d, resetDbFn as i, useProfile as l, MobileShell as n, uid as o, resetAllStores as r, useCourses as s, DAY_LABELS as t, useTodos as u };
