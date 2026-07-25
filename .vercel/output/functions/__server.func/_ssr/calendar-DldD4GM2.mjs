import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as ymd, n as MobileShell, s as useCourses, u as useTodos } from "./store-C7mJTtB7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendar-DldD4GM2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CalendarPage() {
	const [todos, , isTodosLoading] = useTodos();
	const [courses, , isCoursesLoading] = useCourses();
	const isLoading = isTodosLoading || isCoursesLoading;
	const [cursor, setCursor] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const [selected, setSelected] = (0, import_react.useState)(ymd(/* @__PURE__ */ new Date()));
	const year = cursor.getFullYear();
	const month = cursor.getMonth();
	const startDay = (new Date(year, month, 1).getDay() + 6) % 7;
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const cells = [...Array(startDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
	const monthLabel = cursor.toLocaleDateString("en-US", {
		month: "long",
		year: "numeric"
	});
	const tasksByDay = {};
	todos.forEach((t) => {
		if (!t.deadline) return;
		const d = new Date(t.deadline);
		if (d.getFullYear() === year && d.getMonth() === month) tasksByDay[d.getDate()] = (tasksByDay[d.getDate()] || 0) + 1;
	});
	const selectedTasks = todos.filter((t) => t.deadline && ymd(new Date(t.deadline)) === selected).sort((a, b) => +new Date(a.deadline) - +new Date(b.deadline));
	const selectedLabel = new Date(selected).toLocaleDateString("en-US", {
		weekday: "long",
		day: "numeric",
		month: "long"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MobileShell, {
		isLoading,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "px-6 pt-10 pb-4 flex items-center justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-3xl italic",
					children: "Calendar"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-6 flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCursor(new Date(year, month - 1, 1)),
						className: "px-3 py-1 rounded-full bg-secondary text-sm",
						children: "‹"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: monthLabel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCursor(new Date(year, month + 1, 1)),
						className: "px-3 py-1 rounded-full bg-secondary text-sm",
						children: "›"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-6 mt-5 grid grid-cols-7 gap-1 text-center text-[10px] uppercase text-muted-foreground",
				children: [
					"M",
					"T",
					"W",
					"T",
					"F",
					"S",
					"S"
				].map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: d }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-6 mt-1 grid grid-cols-7 gap-1",
				children: cells.map((c, i) => {
					if (!c) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}, i);
					const key = ymd(new Date(year, month, c));
					const today = /* @__PURE__ */ new Date();
					const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === c;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setSelected(key),
						className: "aspect-square rounded-xl flex flex-col items-center justify-center text-sm border " + (key === selected ? "border-foreground bg-pastel-yellow font-semibold " : isToday ? "border-border bg-pastel-yellow/40 font-semibold " : "border-border bg-card "),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c }), tasksByDay[c] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] text-pastel-orange font-bold leading-none",
							children: "●"
						})]
					}, i);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "px-6 mt-6 pb-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-serif text-lg italic mb-3",
					children: selectedLabel
				}), selectedTasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground text-center py-6 border border-dashed border-border rounded-2xl",
					children: "No deadlines on this day."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: selectedTasks.map((t) => {
						const course = courses.find((c) => c.id === t.courseId);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/todo/$id",
							params: { id: t.id },
							className: "rounded-2xl bg-card border border-border p-3 flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-9 h-9 rounded-lg bg-pastel-yellow/60 flex items-center justify-center",
								children: "📝"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium truncate " + (t.done ? "line-through text-muted-foreground" : ""),
									children: t.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted-foreground truncate",
									children: [course?.name ?? t.label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-pastel-orange ml-1",
										children: [
											"·",
											" ",
											new Date(t.deadline).toLocaleTimeString("en-GB", {
												hour: "2-digit",
												minute: "2-digit"
											})
										]
									})]
								})]
							})]
						}, t.id);
					})
				})]
			})
		]
	});
}
//#endregion
export { CalendarPage as component };
