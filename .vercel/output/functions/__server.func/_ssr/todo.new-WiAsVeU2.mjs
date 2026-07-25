import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Plus, p as Image, t as X, x as ChevronDown } from "../_libs/lucide-react.mjs";
import { n as MobileShell, o as uid, s as useCourses, u as useTodos } from "./store-C7mJTtB7.mjs";
import { t as Route } from "./todo.new-CV_3Bzv1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/todo.new-WiAsVeU2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewTodo() {
	const nav = useNavigate();
	const { courseId, edit } = Route.useSearch();
	const [todos, setTodos] = useTodos();
	const [courses] = useCourses();
	const existing = edit ? todos.find((t) => t.id === edit) : void 0;
	const [title, setTitle] = (0, import_react.useState)(existing?.title ?? "");
	const [labelMode, setLabelMode] = (0, import_react.useState)(existing?.courseId ? "Course" : courseId ? "Course" : "Custom");
	const [selectedCourse, setSelectedCourse] = (0, import_react.useState)(existing?.courseId ?? courseId ?? "");
	const [description, setDescription] = (0, import_react.useState)(existing?.description ?? "");
	const [subtasks, setSubtasks] = (0, import_react.useState)(existing?.subtasks ?? []);
	const [newSub, setNewSub] = (0, import_react.useState)("");
	const [deadlineOn, setDeadlineOn] = (0, import_react.useState)(existing?.deadline ? true : true);
	const initDeadline = existing?.deadline ? new Date(existing.deadline) : /* @__PURE__ */ new Date();
	const [date, setDate] = (0, import_react.useState)(`${initDeadline.getFullYear()}-${String(initDeadline.getMonth() + 1).padStart(2, "0")}-${String(initDeadline.getDate()).padStart(2, "0")}`);
	const [time, setTime] = (0, import_react.useState)(existing?.deadline ? `${String(initDeadline.getHours()).padStart(2, "0")}:${String(initDeadline.getMinutes()).padStart(2, "0")}` : "07:37");
	const save = () => {
		if (!title.trim()) return;
		const labelText = labelMode === "Course" ? courses.find((c) => c.id === selectedCourse)?.name ?? "Course" : "Custom";
		const deadline = deadlineOn ? (/* @__PURE__ */ new Date(`${date}T${time}`)).toISOString() : void 0;
		if (existing) {
			setTodos((prev) => prev.map((t) => t.id === existing.id ? {
				...t,
				title: title.trim(),
				label: labelText,
				courseId: labelMode === "Course" ? selectedCourse : void 0,
				description,
				subtasks: subtasks.map((s) => ({
					id: s.id,
					title: s.title,
					done: !!s.done
				})),
				deadline
			} : t));
			nav({
				to: "/todo/$id",
				params: { id: existing.id }
			});
		} else {
			setTodos((prev) => [{
				id: uid(),
				title: title.trim(),
				label: labelText,
				courseId: labelMode === "Course" ? selectedCourse : void 0,
				description,
				subtasks: subtasks.map((s) => ({
					id: s.id,
					title: s.title,
					done: false
				})),
				deadline,
				done: false,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			}, ...prev]);
			nav({ to: "/" });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MobileShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "px-6 pt-10 pb-4 flex items-center justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => nav({ to: "/" }),
					className: "w-9 h-9 rounded-full flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-5 h-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-2xl italic",
					children: existing ? "Edit To-do" : "New To-do"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-9" })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-6 flex justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
					className: "w-7 h-7 text-muted-foreground",
					strokeWidth: 1.4
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-6 mt-6 space-y-5 pb-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "To-do",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "Enter to-do",
						className: "w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-sm"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					label: "Label",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: ["Custom", "Course"].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setLabelMode(m),
							className: "flex-1 py-2.5 rounded-xl border text-sm " + (labelMode === m ? "bg-pastel-yellow border-pastel-yellow font-semibold" : "border-border"),
							children: m
						}, m))
					}), labelMode === "Course" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: selectedCourse,
						onChange: (e) => setSelectedCourse(e.target.value),
						className: "mt-3 w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select a label"
						}), courses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.id,
							children: c.name
						}, c.id))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					label: "Subto-dos",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: newSub,
							onChange: (e) => setNewSub(e.target.value),
							placeholder: "Add subtask",
							className: "flex-1 px-4 py-2 rounded-xl border border-border bg-background outline-none text-sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								if (newSub.trim()) {
									setSubtasks([...subtasks, {
										id: uid(),
										title: newSub.trim()
									}]);
									setNewSub("");
								}
							},
							className: "px-3 rounded-xl bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" })
						})]
					}), subtasks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-1",
						children: subtasks.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex-1",
								children: ["• ", s.title]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSubtasks(subtasks.filter((x) => x.id !== s.id)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3 h-3" })
							})]
						}, s.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Description",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: description,
						onChange: (e) => setDescription(e.target.value),
						placeholder: "Enter a description",
						rows: 3,
						className: "w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-sm resize-none"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold",
							children: "Deadline"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setDeadlineOn(!deadlineOn),
							className: "w-11 h-6 rounded-full transition relative " + (deadlineOn ? "bg-pastel-green" : "bg-secondary"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-0.5 w-5 h-5 rounded-full bg-card transition " + (deadlineOn ? "left-[22px]" : "left-0.5") })
						})]
					}),
					deadlineOn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: date,
							onChange: (e) => setDate(e.target.value),
							className: "flex-1 px-3 py-2 rounded-xl border border-border bg-background outline-none text-sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "time",
							value: time,
							onChange: (e) => setTime(e.target.value),
							className: "w-28 px-3 py-2 rounded-xl border border-border bg-background outline-none text-sm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-muted-foreground mt-2",
						children: "Deadlines show up on the Calendar."
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: save,
					disabled: !title.trim(),
					className: "w-full py-3 rounded-xl bg-foreground text-primary-foreground font-semibold text-sm disabled:opacity-40 mt-4",
					children: existing ? "Save Changes" : "Create"
				})
			]
		})
	] });
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-sm font-semibold mb-2",
		children: label
	}), children] });
}
//#endregion
export { NewTodo as component };
