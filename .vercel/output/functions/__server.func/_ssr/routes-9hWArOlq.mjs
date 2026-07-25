import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Plus, n as Trash2, o as ShoppingBag, x as ChevronDown } from "../_libs/lucide-react.mjs";
import { l as useProfile, n as MobileShell, s as useCourses, u as useTodos } from "./store-C7mJTtB7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-9hWArOlq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const [profile, setProfile, isProfileLoading] = useProfile();
	const [todos, setTodos, isTodosLoading] = useTodos();
	const [courses, , isCoursesLoading] = useCourses();
	const [filter, setFilter] = (0, import_react.useState)("Ongoing");
	const isLoading = isProfileLoading || isTodosLoading || isCoursesLoading;
	const dateLabel = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
		weekday: "long",
		day: "numeric",
		month: "long"
	});
	const visible = todos.filter((t) => filter === "Ongoing" ? !t.done : t.done).slice(0, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MobileShell, {
		isLoading,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "px-6 pt-10 pb-4 flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-serif text-3xl italic leading-tight",
					children: ["Hello, ", profile.name]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: dateLabel
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "w-10 h-10 rounded-full bg-secondary flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {
						className: "w-4 h-4",
						strokeWidth: 1.6
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl bg-pastel-blue/60 p-5 border border-border shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-16 h-16 rounded-2xl bg-card flex items-center justify-center text-2xl",
								children: "🎓"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-serif italic text-2xl",
								children: "Student ID"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-dashed border-foreground/20 my-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-y-2 text-[11px] uppercase tracking-wider",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-foreground/50",
									children: "Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-foreground font-semibold normal-case text-sm tracking-normal",
									children: profile.name
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-foreground/50",
									children: "Birthday"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-foreground font-semibold text-sm tracking-normal",
									children: profile.birthday
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-foreground/50",
									children: "School"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-foreground font-semibold text-sm tracking-normal",
									children: profile.school
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-foreground/50",
									children: "Year level"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-foreground font-semibold text-sm tracking-normal",
									children: profile.yearLevel
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex gap-[2px] h-8 items-end",
							children: Array.from({ length: 42 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-foreground",
								style: {
									width: 2,
									height: `${20 + i * 37 % 80 * .15}px`,
									opacity: i % 3 ? 1 : .4
								}
							}, i))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "px-6 mt-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl italic",
							children: "To-do"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setFilter(filter === "Ongoing" ? "Done" : "Ongoing"),
							className: "flex items-center gap-1 text-xs bg-secondary px-3 py-1.5 rounded-full",
							children: [
								filter,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-3 h-3" })
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/todo/new",
						className: "w-9 h-9 rounded-full bg-foreground text-primary-foreground flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center text-sm text-muted-foreground py-10 border border-dashed border-border rounded-2xl",
						children: "No tasks yet. Tap + to add one."
					}), visible.map((t) => {
						const labelTxt = courses.find((c) => c.id === t.courseId)?.name ?? t.label;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/todo/$id",
							params: { id: t.id },
							className: "rounded-2xl bg-card border border-border p-4 flex items-center gap-3 shadow-sm active:scale-[0.99] transition",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 rounded-xl bg-pastel-yellow/60 flex items-center justify-center text-lg",
									children: "📝"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-sm truncate " + (t.done ? "line-through text-muted-foreground" : ""),
										children: t.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground mt-0.5 truncate",
										children: [labelTxt, t.deadline && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-pastel-orange ml-1",
											children: [
												"|",
												" ",
												new Date(t.deadline).toLocaleString("en-GB", {
													day: "2-digit",
													month: "short",
													year: "numeric",
													hour: "2-digit",
													minute: "2-digit"
												})
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									"aria-label": "toggle",
									onClick: (e) => {
										e.preventDefault();
										e.stopPropagation();
										setTodos((prev) => prev.map((x) => x.id === t.id ? {
											...x,
											done: !x.done
										} : x));
									},
									className: "w-6 h-6 rounded-md border-2 flex items-center justify-center " + (t.done ? "bg-foreground border-foreground" : "border-border"),
									children: t.done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary-foreground text-xs",
										children: "✓"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									"aria-label": "delete",
									onClick: (e) => {
										e.preventDefault();
										e.stopPropagation();
										if (confirm(`Delete "${t.title}"?`)) setTodos((prev) => prev.filter((x) => x.id !== t.id));
									},
									className: "text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
								})
							]
						}, t.id);
					})]
				})]
			})
		]
	});
}
//#endregion
export { Home as component };
