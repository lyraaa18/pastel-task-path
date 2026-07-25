import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { S as Calendar, a as SkipBack, d as Pencil, f as Pause, i as SkipForward, l as Plus, u as Play, v as ClipboardList } from "../_libs/lucide-react.mjs";
import { a as startOfWeek, n as MobileShell, s as useCourses } from "./store-C7mJTtB7.mjs";
import { t as CourseForm } from "./CourseForm-DRCxEmuH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/schedule-CDF0W9QD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var dayShort = [
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun"
];
var colorMap = {
	orange: "bg-pastel-orange border-pastel-orange/30",
	blue: "bg-pastel-blue border-pastel-blue/30",
	gray: "bg-pastel-gray border-pastel-gray/30",
	yellow: "bg-pastel-yellow border-pastel-yellow/30",
	pink: "bg-pastel-pink border-pastel-pink/30",
	green: "bg-pastel-green border-pastel-green/30"
};
var borderColors = {
	orange: "border-pastel-orange/40 text-orange-800 bg-pastel-orange/10",
	blue: "border-pastel-blue/40 text-blue-800 bg-pastel-blue/10",
	gray: "border-pastel-gray/40 text-gray-800 bg-pastel-gray/10",
	yellow: "border-pastel-yellow/40 text-yellow-800 bg-pastel-yellow/10",
	pink: "border-pastel-pink/40 text-pink-800 bg-pastel-pink/10",
	green: "border-pastel-green/40 text-green-800 bg-pastel-green/10"
};
function SchedulePage() {
	const [courses, setCourses, isLoading] = useCourses();
	const today = /* @__PURE__ */ new Date();
	const week = startOfWeek(today);
	const [selected, setSelected] = (0, import_react.useState)((today.getDay() + 6) % 7);
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [editingCourse, setEditingCourse] = (0, import_react.useState)(null);
	const [playerIndex, setPlayerIndex] = (0, import_react.useState)(null);
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(false);
	const [viewMode, setViewMode] = (0, import_react.useState)("daily");
	const dateLabel = today.toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric"
	});
	const isSelectedToday = selected === (today.getDay() + 6) % 7;
	const getClassesForDay = (0, import_react.useCallback)((dayIdx) => {
		return courses.flatMap((c) => {
			if (c.schedules && c.schedules.length > 0) return c.schedules.filter((s) => s.days.includes(dayIdx)).map((s) => ({
				...c,
				time: `${s.start} - ${s.end}`,
				startTime: s.start,
				endTime: s.end
			}));
			return [];
		}).sort((a, b) => a.startTime.localeCompare(b.startTime));
	}, [courses]);
	const dayClasses = (0, import_react.useMemo)(() => {
		return getClassesForDay(selected);
	}, [getClassesForDay, selected]);
	(0, import_react.useEffect)(() => {
		if (dayClasses.length === 0) {
			setPlayerIndex(null);
			return;
		}
		if (isSelectedToday) {
			const nowHours = (/* @__PURE__ */ new Date()).getHours();
			const nowMins = (/* @__PURE__ */ new Date()).getMinutes();
			const nowTimeStr = `${String(nowHours).padStart(2, "0")}:${String(nowMins).padStart(2, "0")}`;
			const activeIdx = dayClasses.findIndex((c) => c.startTime <= nowTimeStr && nowTimeStr <= c.endTime);
			if (activeIdx !== -1) {
				setPlayerIndex(activeIdx);
				return;
			}
			const upcomingIdx = dayClasses.findIndex((c) => c.startTime > nowTimeStr);
			if (upcomingIdx !== -1) {
				setPlayerIndex(upcomingIdx);
				return;
			}
		}
		setPlayerIndex(0);
	}, [
		selected,
		dayClasses,
		isSelectedToday
	]);
	const featuredClass = playerIndex !== null && dayClasses[playerIndex] ? dayClasses[playerIndex] : void 0;
	const getProgress = (c) => {
		const [sh, sm] = c.startTime.split(":").map(Number);
		const [eh, em] = c.endTime.split(":").map(Number);
		const now = /* @__PURE__ */ new Date();
		const curMin = now.getHours() * 60 + now.getMinutes();
		const startMin = sh * 60 + sm;
		const endMin = eh * 60 + em;
		if (curMin < startMin) return 0;
		if (curMin > endMin) return 100;
		return Math.round((curMin - startMin) / (endMin - startMin) * 100);
	};
	const isClassActive = featuredClass && isSelectedToday && (() => {
		const nowHours = (/* @__PURE__ */ new Date()).getHours();
		const nowMins = (/* @__PURE__ */ new Date()).getMinutes();
		const nowTimeStr = `${String(nowHours).padStart(2, "0")}:${String(nowMins).padStart(2, "0")}`;
		return featuredClass.startTime <= nowTimeStr && nowTimeStr <= featuredClass.endTime;
	})();
	const progress = featuredClass ? isClassActive ? getProgress(featuredClass) : isSelectedToday && (/* @__PURE__ */ new Date()).getHours() * 60 + (/* @__PURE__ */ new Date()).getMinutes() > featuredClass.endTime.split(":").map(Number)[0] * 60 + featuredClass.endTime.split(":").map(Number)[1] ? 100 : 0 : 0;
	const handlePrev = () => {
		if (dayClasses.length <= 1) return;
		setPlayerIndex((prev) => prev === null || prev === 0 ? dayClasses.length - 1 : prev - 1);
	};
	const handleNext = () => {
		if (dayClasses.length <= 1) return;
		setPlayerIndex((prev) => prev === null || prev === dayClasses.length - 1 ? 0 : prev + 1);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MobileShell, {
		isLoading,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "px-6 pt-10 pb-2 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-3xl italic",
					children: "Class Schedule"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: dateLabel
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setAdding(true),
					className: "w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-muted active:scale-95 transition",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-5 h-5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6 mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-secondary p-1 rounded-2xl flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setViewMode("daily"),
						className: `flex-1 py-2.5 text-xs rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${viewMode === "daily" ? "bg-card text-foreground shadow-sm font-bold scale-[1.01]" : "text-muted-foreground hover:text-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "w-3.5 h-3.5" }), " Daily Timeline"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setViewMode("weekly"),
						className: `flex-1 py-2.5 text-xs rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${viewMode === "weekly" ? "bg-card text-foreground shadow-sm font-bold scale-[1.01]" : "text-muted-foreground hover:text-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3.5 h-3.5" }), " Weekly Timetable"]
					})]
				})
			}),
			viewMode === "daily" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "px-6 mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl bg-card border border-border p-5 shadow-sm relative overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4 relative z-10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `w-16 h-16 rounded-xl ${featuredClass ? colorMap[featuredClass.color] : "bg-pastel-gray"} flex items-center justify-center text-2xl transition`,
										children: featuredClass ? "📚" : "🎵"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold truncate",
											children: featuredClass ? featuredClass.name : "No class"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground truncate",
											children: featuredClass ? isClassActive ? `In session · ${100 - progress}% remaining` : isSelectedToday && progress === 100 ? "Completed today" : "Scheduled" : "Free Time"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] uppercase tracking-widest text-muted-foreground shrink-0 flex items-center gap-1.5",
										children: [featuredClass && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: (e) => {
												e.stopPropagation();
												setEditingCourse(featuredClass);
											},
											className: "p-1 rounded-full bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition",
											title: "Edit Course",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-3 h-3" })
										}), dayClasses.length > 0 && playerIndex !== null ? `${playerIndex + 1}/${dayClasses.length}` : "iPod"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 h-1.5 rounded-full bg-secondary overflow-hidden relative z-10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `h-full bg-foreground transition-all duration-500 ${isPlaying ? "animate-pulse" : ""}`,
									style: { width: `${featuredClass ? progress : 0}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex justify-between text-[10px] text-muted-foreground relative z-10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: featuredClass ? featuredClass.startTime : "00:00" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: featuredClass ? featuredClass.endTime : "00:00" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-center gap-6 relative z-10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: handlePrev,
										disabled: dayClasses.length <= 1,
										className: "text-foreground disabled:opacity-30 active:scale-90 transition p-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipBack, { className: "w-5 h-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setIsPlaying(!isPlaying),
										className: "w-12 h-12 rounded-full bg-foreground text-primary-foreground flex items-center justify-center active:scale-95 transition hover:opacity-90",
										children: isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-5 h-5 ml-0.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: handleNext,
										disabled: dayClasses.length <= 1,
										className: "text-foreground disabled:opacity-30 active:scale-90 transition p-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "w-5 h-5" })
									})
								]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "px-6 mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-between",
						children: dayShort.map((d, i) => {
							new Date(week).setDate(week.getDate() + i);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelected(i),
								className: "flex flex-col items-center gap-1 px-3 py-2 rounded-full transition " + (i === selected ? "bg-pastel-yellow font-semibold" : ""),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs",
									children: d
								})
							}, d);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "px-6 mt-6 space-y-3 pb-24",
					children: dayClasses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground",
						children: "No classes — enjoy your free time."
					}) : dayClasses.map((c, idx) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => setPlayerIndex(idx),
							className: `rounded-2xl border p-4 cursor-pointer transition active:scale-[0.99] ${idx === playerIndex ? "border-foreground bg-card shadow-md scale-[1.01]" : "border-border bg-card/60 hover:bg-card"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground font-semibold",
										children: c.time
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [c.instructor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full",
											children: c.instructor
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: (e) => {
												e.stopPropagation();
												setEditingCourse(c);
											},
											className: "text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-secondary transition shrink-0",
											title: "Edit Course",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-3.5 h-3.5" })
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-serif text-lg italic mt-1",
									children: c.name
								}),
								c.room && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground mt-1",
									children: ["Room ", c.room]
								})
							]
						}, `${c.id}-${idx}`);
					})
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6 mt-6 space-y-4 pb-24",
				children: dayShort.map((dayName, idx) => {
					const classes = getClassesForDay(idx);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-border bg-card/40 p-4 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center border-b border-border/50 pb-2 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-xs uppercase tracking-wider text-muted-foreground",
								children: dayName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] font-semibold bg-secondary px-2 py-0.5 rounded-full text-muted-foreground",
								children: [
									classes.length,
									" class",
									classes.length === 1 ? "" : "es"
								]
							})]
						}), classes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground/50 italic py-2",
							children: "No classes scheduled"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2.5",
							children: classes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `rounded-2xl border p-3.5 flex justify-between items-center gap-3 bg-card shadow-sm ${borderColors[c.color]}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-serif text-base italic truncate leading-tight",
										children: c.name
									}), c.room && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] opacity-80 mt-1 font-medium",
										children: ["Room ", c.room]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-semibold text-right opacity-90",
										children: c.time
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: (e) => {
											e.stopPropagation();
											setEditingCourse(c);
										},
										className: "p-1 rounded-full hover:bg-black/5 opacity-70 hover:opacity-100 transition shrink-0 text-foreground",
										title: "Edit Course",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-3.5 h-3.5" })
									})]
								})]
							}, `${c.id}-${c.startTime}`))
						})]
					}, dayName);
				})
			}),
			adding && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseForm, {
				onClose: () => setAdding(false),
				onSave: (newCourse) => {
					setCourses((prev) => [...prev, newCourse]);
					setAdding(false);
				}
			}),
			editingCourse && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseForm, {
				initial: editingCourse,
				onClose: () => setEditingCourse(null),
				onSave: (updated) => {
					setCourses((prev) => prev.map((x) => x.id === updated.id ? updated : x));
					setEditingCourse(null);
				},
				onDelete: () => {
					if (confirm(`Delete "${editingCourse.name}"?`)) {
						setCourses((prev) => prev.filter((x) => x.id !== editingCourse.id));
						setEditingCourse(null);
					}
				}
			})
		]
	});
}
//#endregion
export { SchedulePage as component };
