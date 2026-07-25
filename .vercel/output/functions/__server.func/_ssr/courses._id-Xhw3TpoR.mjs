import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { f as Link, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as ChevronLeft, g as ExternalLink, l as Plus, n as Trash2, x as ChevronDown } from "../_libs/lucide-react.mjs";
import { n as MobileShell, o as uid, s as useCourses, t as DAY_LABELS, u as useTodos } from "./store-C7mJTtB7.mjs";
import { t as CourseForm } from "./CourseForm-DRCxEmuH.mjs";
import { t as Route } from "./courses._id-C1aStPET.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/courses._id-Xhw3TpoR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var gradients = {
	orange: "from-pastel-orange via-pastel-yellow to-background",
	blue: "from-pastel-blue via-pastel-gray to-background",
	gray: "from-pastel-gray via-pastel-blue/40 to-background",
	yellow: "from-pastel-yellow via-pastel-orange/40 to-background",
	pink: "from-pastel-pink via-pastel-orange/30 to-background",
	green: "from-pastel-green via-pastel-yellow/30 to-background"
};
var tabs = ["To-do", "Links"];
function CourseDetail() {
	const { id } = Route.useParams();
	const nav = useNavigate();
	const [courses, setCourses, isCoursesLoading] = useCourses();
	const [todos, setTodos, isTodosLoading] = useTodos();
	const [tab, setTab] = (0, import_react.useState)("To-do");
	const [filter, setFilter] = (0, import_react.useState)("Ongoing");
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [newLinkTitle, setNewLinkTitle] = (0, import_react.useState)("");
	const [newLinkUrl, setNewLinkUrl] = (0, import_react.useState)("");
	if (isCoursesLoading || isTodosLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileShell, {
		isLoading: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Loading..." })
	});
	const course = courses.find((c) => c.id === id);
	if (!course) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-10 text-center text-muted-foreground",
		children: ["Course not found.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => nav({ to: "/courses" }),
			className: "block mx-auto mt-4 text-sm underline",
			children: "Back to courses"
		})]
	}) });
	const courseTodos = todos.filter((t) => t.courseId === id && (filter === "Ongoing" ? !t.done : t.done));
	const schedText = course.schedules?.length ? course.schedules.map((s) => `${s.days.map((d) => DAY_LABELS[d].toUpperCase().slice(0, 3)).join("/")} | ${s.start} - ${s.end}`).join(" • ") : "—";
	const updateCourse = (updated) => {
		setCourses((prev) => prev.map((c) => c.id === updated.id ? updated : c));
	};
	const addLink = (title, url) => {
		if (!title.trim() || !url.trim()) return;
		let formattedUrl = url.trim();
		if (!/^https?:\/\//i.test(formattedUrl)) formattedUrl = `https://${formattedUrl}`;
		const newLink = {
			id: uid(),
			title: title.trim(),
			url: formattedUrl
		};
		const updated = {
			...course,
			links: [...course.links || [], newLink]
		};
		updateCourse(updated);
		setNewLinkTitle("");
		setNewLinkUrl("");
	};
	const deleteLink = (lid) => {
		const updated = {
			...course,
			links: (course.links || []).filter((l) => l.id !== lid)
		};
		updateCourse(updated);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MobileShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `relative h-64 bg-gradient-to-b ${gradients[course.color]}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => nav({ to: "/courses" }),
				className: "absolute top-10 left-5 w-10 h-10 rounded-full bg-foreground/15 backdrop-blur flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-5 h-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setEditing(true),
				className: "absolute bottom-6 right-5 text-xs px-3 py-1.5 rounded-full bg-card border border-border",
				children: "Edit Course"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-6 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-3xl italic lowercase",
					children: course.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "👤 Instructor",
							value: course.instructor ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "🕐 Schedules",
							value: schedText
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "📍 Room Location",
							value: course.room ?? "—"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex gap-2 overflow-x-auto pb-2",
					children: tabs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setTab(t);
							setEditingSetId(null);
						},
						className: "px-4 py-1.5 rounded-full text-xs whitespace-nowrap " + (tab === t ? "bg-pastel-yellow font-semibold" : "bg-secondary text-muted-foreground"),
						children: t
					}, t))
				}),
				tab === "To-do" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setFilter(filter === "Ongoing" ? "Done" : "Ongoing"),
							className: "flex items-center gap-1 text-xs bg-secondary px-3 py-1.5 rounded-full",
							children: [
								filter,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-3 h-3" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/todo/new",
							search: { courseId: id },
							className: "text-xs px-3 py-1.5 rounded-full bg-pastel-yellow font-semibold",
							children: "+ To-do"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 space-y-3 pb-10",
						children: courseTodos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center py-10 text-muted-foreground text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-4xl mb-3",
									children: "📋"
								}),
								"No tasks to accomplish.",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/todo/new",
										search: { courseId: id },
										className: "inline-block text-xs px-4 py-2 rounded-full bg-pastel-yellow font-semibold",
										children: "+ To-do"
									})
								})
							]
						}) : courseTodos.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/todo/$id",
								params: { id: t.id },
								className: "rounded-2xl bg-card border border-border p-4 flex items-center gap-3 active:scale-[0.99] transition",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-9 h-9 rounded-lg bg-pastel-yellow/60 flex items-center justify-center",
										children: "📝"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-medium truncate " + (t.done ? "line-through text-muted-foreground" : ""),
											children: t.title
										}), t.deadline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-pastel-orange mt-0.5",
											children: new Date(t.deadline).toLocaleString("en-GB", {
												day: "2-digit",
												month: "short",
												hour: "2-digit",
												minute: "2-digit"
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
										onClick: (e) => {
											e.preventDefault();
											e.stopPropagation();
											if (confirm(`Delete "${t.title}"?`)) setTodos((prev) => prev.filter((x) => x.id !== t.id));
										},
										className: "text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
									})
								]
							})
						}, t.id))
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 pb-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 bg-card/40 border border-border p-4 rounded-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: newLinkTitle,
							onChange: (e) => setNewLinkTitle(e.target.value),
							placeholder: "Link Title (e.g., Course Portal)",
							className: "w-full px-4 py-2.5 rounded-xl border border-border bg-background outline-none text-sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: newLinkUrl,
								onChange: (e) => setNewLinkUrl(e.target.value),
								placeholder: "URL (e.g., portal.school.edu)",
								className: "flex-1 px-4 py-2.5 rounded-xl border border-border bg-background outline-none text-sm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => addLink(newLinkTitle, newLinkUrl),
								className: "px-4 rounded-xl bg-pastel-yellow font-semibold text-xs flex items-center gap-1 active:scale-95 transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), " Add Link"]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 space-y-3",
						children: !course.links || course.links.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center py-10 text-muted-foreground text-sm border border-dashed border-border rounded-2xl bg-card/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-4xl mb-3",
								children: "🔗"
							}), "No links saved yet."]
						}) : course.links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-card border border-border p-4 flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 rounded-xl bg-pastel-green/60 flex items-center justify-center text-lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
										className: "w-5 h-5 text-green-800",
										strokeWidth: 1.5
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium truncate",
										children: link.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: link.url,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "text-xs text-pastel-blue hover:underline block truncate mt-0.5 flex items-center gap-1",
										children: link.url
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => deleteLink(link.id),
									className: "text-muted-foreground hover:text-destructive p-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
								})
							]
						}, link.id))
					})]
				})
			]
		}),
		editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseForm, {
			initial: course,
			onClose: () => setEditing(false),
			onSave: (updated) => {
				setCourses((prev) => prev.map((c) => c.id === updated.id ? updated : c));
				setEditing(false);
			},
			onDelete: () => {
				if (confirm(`Delete "${course.name}"?`)) {
					setCourses((prev) => prev.filter((c) => c.id !== course.id));
					nav({ to: "/courses" });
				}
			}
		})
	] });
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-foreground/80",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex-1 border-b border-dashed border-border" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-foreground/80 text-right",
				children: value
			})
		]
	});
}
//#endregion
export { CourseDetail as component };
