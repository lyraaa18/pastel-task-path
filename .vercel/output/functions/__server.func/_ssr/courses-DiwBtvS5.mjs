import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as useRouterState, c as Outlet, f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Search, l as Plus, n as Trash2 } from "../_libs/lucide-react.mjs";
import { n as MobileShell, s as useCourses } from "./store-C7mJTtB7.mjs";
import { t as CourseForm } from "./CourseForm-DRCxEmuH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/courses-DiwBtvS5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var colorMap = {
	orange: "bg-pastel-orange",
	blue: "bg-pastel-blue",
	gray: "bg-pastel-gray",
	yellow: "bg-pastel-yellow",
	pink: "bg-pastel-pink",
	green: "bg-pastel-green"
};
function CoursesPage() {
	const path = useRouterState({ select: (s) => s.location.pathname });
	const [courses, setCourses, isLoading] = useCourses();
	const [q, setQ] = (0, import_react.useState)("");
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [manage, setManage] = (0, import_react.useState)(false);
	if (!(path === "/courses" || path === "/courses/")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	const filtered = courses.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MobileShell, {
		isLoading,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "px-6 pt-10 pb-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-3xl italic",
					children: "Courses"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setManage((m) => !m),
					className: "text-xs px-3 py-1.5 rounded-full border " + (manage ? "bg-pastel-yellow border-pastel-yellow font-semibold" : "border-border text-muted-foreground"),
					children: manage ? "Done" : "Manage"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 px-4 py-3 rounded-full bg-card border border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Find a course",
						className: "bg-transparent outline-none text-sm flex-1"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6 mt-6 grid grid-cols-2 gap-4",
				children: filtered.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/courses/$id",
						params: { id: c.id },
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-4 w-2/3 rounded-t-xl ${colorMap[c.color]} border border-b-0 border-foreground/10` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `rounded-2xl rounded-tl-none ${colorMap[c.color]} aspect-square border border-foreground/10 shadow-sm flex items-end p-3`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] uppercase tracking-wider font-semibold bg-card/70 backdrop-blur px-2 py-1 rounded-md",
								children: c.name
							})
						})]
					}), manage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							if (confirm(`Delete "${c.name}"? Tasks linked to it will keep their label.`)) setCourses((prev) => prev.filter((x) => x.id !== c.id));
						},
						className: "absolute -top-2 -right-2 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
					})]
				}, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setAdding(true),
				className: "fixed bottom-24 right-6 sm:right-[calc(50%-200px)] w-14 h-14 rounded-full bg-foreground text-primary-foreground flex items-center justify-center shadow-lg z-30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-6 h-6" })
			}),
			adding && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseForm, {
				onClose: () => setAdding(false),
				onSave: (c) => {
					setCourses((prev) => [...prev, c]);
					setAdding(false);
				}
			})
		]
	});
}
//#endregion
export { CoursesPage as component };
