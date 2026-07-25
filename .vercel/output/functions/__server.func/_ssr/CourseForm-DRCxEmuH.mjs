import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Clock, n as Trash2, t as X, x as ChevronDown } from "../_libs/lucide-react.mjs";
import { o as uid, t as DAY_LABELS } from "./store-C7mJTtB7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CourseForm-DRCxEmuH.js
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
var colorChoices = [
	"orange",
	"blue",
	"gray",
	"yellow",
	"pink",
	"green"
];
function CourseForm({ initial, onClose, onSave, onDelete }) {
	const [name, setName] = (0, import_react.useState)(initial?.name ?? "");
	const [color, setColor] = (0, import_react.useState)(initial?.color ?? "orange");
	const [instructor, setInstructor] = (0, import_react.useState)(initial?.instructor ?? "");
	const [room, setRoom] = (0, import_react.useState)(initial?.room ?? "");
	const [schedules, setSchedules] = (0, import_react.useState)(initial?.schedules || []);
	const updateSch = (id, patch) => setSchedules((prev) => prev.map((s) => s.id === id ? {
		...s,
		...patch
	} : s));
	const toggleDay = (id, d) => setSchedules((prev) => prev.map((s) => s.id === id ? {
		...s,
		days: s.days.includes(d) ? s.days.filter((x) => x !== d) : [...s.days, d].sort()
	} : s));
	const canSave = name.trim().length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 bg-black/40 flex items-end justify-center animate-fade-in",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-[440px] bg-card rounded-t-3xl max-h-[92vh] overflow-y-auto border-t border-border shadow-2xl transition-all duration-300",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 bg-card/95 backdrop-blur px-6 pt-6 pb-3 flex items-center justify-between border-b border-border/50 z-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "p-1 rounded-full hover:bg-secondary transition active:scale-95",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-5 h-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl italic",
						children: initial ? "Edit Course" : "New Course"
					}),
					onDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onDelete,
						className: "text-destructive p-1 rounded-full hover:bg-destructive/10 transition active:scale-95",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-5" })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-6 pt-5 pb-8 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-5 w-24 rounded-t-xl ${colorMap[color]} border border-b-0 border-foreground/10` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-40 h-32 rounded-2xl rounded-tl-none ${colorMap[color]} border border-foreground/10 shadow-sm` })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-wider text-muted-foreground mb-2",
						children: "Color"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 justify-center",
						children: colorChoices.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setColor(c),
							className: `w-8 h-8 rounded-full ${colorMap[c]} border-2 ${color === c ? "border-foreground scale-110" : "border-transparent"} transition active:scale-95`
						}, c))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Course Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "e.g. Calculus II",
							className: "w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-sm font-semibold"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Instructor",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: instructor,
							onChange: (e) => setInstructor(e.target.value),
							placeholder: "e.g. Prof. Davis (Optional)",
							className: "w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-sm font-semibold"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Room Location",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: room,
							onChange: (e) => setRoom(e.target.value),
							placeholder: "e.g. Hall C-3 (Optional)",
							className: "w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-sm font-semibold"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t border-border/40 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold",
								children: "Class Schedules"
							}), schedules.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSchedules([{
									id: uid(),
									days: [],
									start: "",
									end: ""
								}]),
								className: "text-xs font-bold bg-secondary hover:bg-muted text-foreground px-3.5 py-1.5 rounded-full active:scale-95 transition",
								children: "+ Add Schedule"
							})]
						}), schedules.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [schedules.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 p-4 rounded-2xl border border-border bg-secondary/15 relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs font-bold text-muted-foreground uppercase tracking-wider",
											children: ["Schedule #", idx + 1]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setSchedules((prev) => prev.filter((x) => x.id !== s.id)),
											className: "w-6 h-6 rounded-full bg-secondary/40 hover:bg-destructive/15 text-muted-foreground hover:text-destructive flex items-center justify-center transition",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
											children: "Days"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex gap-1.5",
											children: DAY_LABELS.map((d, i) => {
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => toggleDay(s.id, i),
													className: "flex-1 py-2 rounded-xl text-xs font-bold border transition " + (s.days.includes(i) ? "bg-pastel-yellow border-pastel-yellow text-foreground shadow-sm scale-[1.02]" : "border-border text-muted-foreground bg-background hover:bg-secondary/30"),
													children: d
												}, i);
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
												children: "Start"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-background",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
													className: "w-4 h-4 text-muted-foreground",
													strokeWidth: 1.8
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "time",
													value: s.start,
													onChange: (e) => updateSch(s.id, { start: e.target.value }),
													className: "flex-1 bg-transparent outline-none text-sm font-bold"
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
												children: "End"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-background",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
													className: "w-4 h-4 text-muted-foreground",
													strokeWidth: 1.8
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "time",
													value: s.end,
													onChange: (e) => updateSch(s.id, { end: e.target.value }),
													className: "flex-1 bg-transparent outline-none text-sm font-bold"
												})]
											})]
										})]
									})
								]
							}, s.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSchedules((prev) => [...prev, {
									id: uid(),
									days: [],
									start: "",
									end: ""
								}]),
								className: "w-full py-3 rounded-2xl border border-dashed border-border text-xs font-bold text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 hover:bg-secondary/10 transition active:scale-[0.98]",
								children: "+ Add Another Time Slot"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !canSave,
						onClick: () => {
							const cleanedSchedules = schedules.filter((s) => s.days.length && s.start && s.end);
							onSave({
								id: initial?.id ?? uid(),
								name: name.trim(),
								color,
								instructor: instructor.trim() || void 0,
								room: room.trim() || void 0,
								schedules: cleanedSchedules.length ? cleanedSchedules : void 0
							});
						},
						className: "w-full py-4 rounded-2xl bg-foreground text-primary-foreground font-semibold text-sm disabled:opacity-40 hover:opacity-95 shadow-sm active:scale-98 transition z-10",
						children: initial ? "Save Changes" : "Create"
					})
				]
			})]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-sm font-semibold mb-2",
		children: label
	}), children] });
}
//#endregion
export { CourseForm as t };
