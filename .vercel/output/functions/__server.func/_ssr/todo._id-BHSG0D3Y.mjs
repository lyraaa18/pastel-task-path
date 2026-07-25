import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as Link, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as Calendar, b as ChevronLeft, d as Pencil, n as Trash2, r as Tag } from "../_libs/lucide-react.mjs";
import { n as MobileShell, s as useCourses, u as useTodos } from "./store-C7mJTtB7.mjs";
import { t as Route } from "./todo._id-40m8iPRf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/todo._id-BHSG0D3Y.js
var import_jsx_runtime = require_jsx_runtime();
function TodoDetail() {
	const { id } = Route.useParams();
	const nav = useNavigate();
	const [todos, setTodos, isTodosLoading] = useTodos();
	const [courses, , isCoursesLoading] = useCourses();
	if (isTodosLoading || isCoursesLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileShell, {
		isLoading: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Loading..." })
	});
	const todo = todos.find((t) => t.id === id);
	if (!todo) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-10 text-center text-muted-foreground",
		children: ["Task not found.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => nav({ to: "/" }),
			className: "block mx-auto mt-4 text-sm underline",
			children: "Back home"
		})]
	}) });
	const labelTxt = courses.find((c) => c.id === todo.courseId)?.name ?? todo.label;
	const toggleMain = () => setTodos((prev) => prev.map((t) => t.id === id ? {
		...t,
		done: !t.done
	} : t));
	const toggleSub = (sid) => setTodos((prev) => prev.map((t) => t.id === id ? {
		...t,
		subtasks: t.subtasks.map((s) => s.id === sid ? {
			...s,
			done: !s.done
		} : s)
	} : t));
	const remove = () => {
		if (!confirm(`Delete "${todo.title}"?`)) return;
		setTodos((prev) => prev.filter((t) => t.id !== id));
		nav({ to: "/" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MobileShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "px-6 pt-10 pb-4 flex items-center justify-between",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => nav({ to: "/" }),
				className: "w-9 h-9 rounded-full bg-secondary flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-5 h-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-xl italic",
				children: "Task"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/todo/new",
					search: { edit: todo.id },
					className: "w-9 h-9 rounded-full bg-secondary flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-4 h-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: remove,
					className: "w-9 h-9 rounded-full bg-destructive/15 text-destructive flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
				})]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-6 pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-3xl bg-pastel-yellow/50 border border-border p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: toggleMain,
						className: "mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 " + (todo.done ? "bg-foreground border-foreground" : "border-foreground/40"),
						children: todo.done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary-foreground text-xs",
							children: "✓"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-2xl italic " + (todo.done ? "line-through text-muted-foreground" : ""),
							children: todo.title
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 space-y-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "w-4 h-4 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Label"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-auto font-medium",
							children: labelTxt
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Deadline"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-auto font-medium",
							children: todo.deadline ? new Date(todo.deadline).toLocaleString("en-GB", {
								day: "2-digit",
								month: "short",
								year: "numeric",
								hour: "2-digit",
								minute: "2-digit"
							}) : "No deadline"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase tracking-wider text-muted-foreground mb-2",
					children: "Description"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-border p-4 text-sm min-h-[80px] whitespace-pre-wrap",
					children: todo.description || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "No description."
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs uppercase tracking-wider text-muted-foreground mb-2",
					children: [
						"Subtasks (",
						todo.subtasks.filter((s) => s.done).length,
						"/",
						todo.subtasks.length,
						")"
					]
				}), todo.subtasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground text-center py-4",
					children: "No subtasks."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: todo.subtasks.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 rounded-xl border border-border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => toggleSub(s.id),
							className: "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 " + (s.done ? "bg-foreground border-foreground" : "border-foreground/40"),
							children: s.done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary-foreground text-[10px]",
								children: "✓"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm " + (s.done ? "line-through text-muted-foreground" : ""),
							children: s.title
						})]
					}, s.id))
				})]
			})
		]
	})] });
}
//#endregion
export { TodoDetail as component };
