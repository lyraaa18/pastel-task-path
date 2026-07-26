import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useCourses, startOfWeek, type Course } from "@/lib/store";
import { Plus, Play, Pause, SkipBack, SkipForward, Calendar, ClipboardList, Pencil } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { CourseForm } from "@/components/CourseForm";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Class Schedule — SYNAPSE" },
      { name: "description", content: "Your weekly class schedule." },
    ],
  }),
  component: SchedulePage,
});

const dayShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dayKey = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const colorMap: Record<Course["color"], string> = {
  orange: "bg-pastel-orange border-pastel-orange/30",
  blue: "bg-pastel-blue border-pastel-blue/30",
  gray: "bg-pastel-gray border-pastel-gray/30",
  yellow: "bg-pastel-yellow border-pastel-yellow/30",
  pink: "bg-pastel-pink border-pastel-pink/30",
  green: "bg-pastel-green border-pastel-green/30",
};

// Pastel tag border colors specifically for outline styling
const borderColors: Record<Course["color"], string> = {
  orange: "border-pastel-orange/40 text-orange-800 bg-pastel-orange/10",
  blue: "border-pastel-blue/40 text-blue-800 bg-pastel-blue/10",
  gray: "border-pastel-gray/40 text-gray-800 bg-pastel-gray/10",
  yellow: "border-pastel-yellow/40 text-yellow-800 bg-pastel-yellow/10",
  pink: "border-pastel-pink/40 text-pink-800 bg-pastel-pink/10",
  green: "border-pastel-green/40 text-green-800 bg-pastel-green/10",
};

function SchedulePage() {
  const [courses, setCourses, isLoading] = useCourses();
  const today = new Date();
  const week = startOfWeek(today);
  const [selected, setSelected] = useState((today.getDay() + 6) % 7);
  const [adding, setAdding] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [playerIndex, setPlayerIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");

  const dateLabel = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const isSelectedToday = selected === (today.getDay() + 6) % 7;

  // Resolve matching schedules for a given day index
  const getClassesForDay = useCallback(
    (dayIdx: number) => {
      return courses
        .flatMap((c) => {
          if (c.schedules && c.schedules.length > 0) {
            return c.schedules
              .filter((s) => s.days.includes(dayIdx))
              .map((s) => ({
                ...c,
                time: `${s.start} - ${s.end}`,
                startTime: s.start,
                endTime: s.end,
              }));
          }
          return [];
        })
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    },
    [courses],
  );

  // Active day classes
  const dayClasses = useMemo(() => {
    return getClassesForDay(selected);
  }, [getClassesForDay, selected]);

  useEffect(() => {
    if (dayClasses.length === 0) {
      setPlayerIndex(null);
      return;
    }
    if (isSelectedToday) {
      const nowHours = new Date().getHours();
      const nowMins = new Date().getMinutes();
      const nowTimeStr = `${String(nowHours).padStart(2, "0")}:${String(nowMins).padStart(2, "0")}`;
      const activeIdx = dayClasses.findIndex(
        (c) => c.startTime <= nowTimeStr && nowTimeStr <= c.endTime,
      );
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
  }, [selected, dayClasses, isSelectedToday]);

  const featuredClass =
    playerIndex !== null && dayClasses[playerIndex] ? dayClasses[playerIndex] : undefined;

  const getProgress = (c: (typeof dayClasses)[0]) => {
    const [sh, sm] = c.startTime.split(":").map(Number);
    const [eh, em] = c.endTime.split(":").map(Number);
    const now = new Date();
    const curMin = now.getHours() * 60 + now.getMinutes();
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    if (curMin < startMin) return 0;
    if (curMin > endMin) return 100;
    return Math.round(((curMin - startMin) / (endMin - startMin)) * 100);
  };

  const isClassActive =
    featuredClass &&
    isSelectedToday &&
    (() => {
      const nowHours = new Date().getHours();
      const nowMins = new Date().getMinutes();
      const nowTimeStr = `${String(nowHours).padStart(2, "0")}:${String(nowMins).padStart(2, "0")}`;
      return featuredClass.startTime <= nowTimeStr && nowTimeStr <= featuredClass.endTime;
    })();

  const progress = featuredClass
    ? isClassActive
      ? getProgress(featuredClass)
      : isSelectedToday &&
        new Date().getHours() * 60 + new Date().getMinutes() >
        featuredClass.endTime.split(":").map(Number)[0] * 60 +
        featuredClass.endTime.split(":").map(Number)[1]
        ? 100
        : 0
    : 0;

  const handlePrev = () => {
    if (dayClasses.length <= 1) return;
    setPlayerIndex((prev) => (prev === null || prev === 0 ? dayClasses.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (dayClasses.length <= 1) return;
    setPlayerIndex((prev) => (prev === null || prev === dayClasses.length - 1 ? 0 : prev + 1));
  };

  return (
    <MobileShell isLoading={isLoading}>
      <header className="px-6 pt-10 pb-2 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl italic">Class Schedule</h1>
          <p className="text-sm text-muted-foreground mt-1">{dateLabel}</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-muted active:scale-95 transition"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      {/* View Selector Switch */}
      <section className="px-6 mt-4">
        <div className="bg-secondary p-1 rounded-2xl flex gap-1">
          <button
            onClick={() => setViewMode("daily")}
            className={`flex-1 py-2.5 text-xs rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${viewMode === "daily"
                ? "bg-card text-foreground shadow-sm font-bold scale-[1.01]"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <ClipboardList className="w-3.5 h-3.5" /> Daily Timeline
          </button>
          <button
            onClick={() => setViewMode("weekly")}
            className={`flex-1 py-2.5 text-xs rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${viewMode === "weekly"
                ? "bg-card text-foreground shadow-sm font-bold scale-[1.01]"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Weekly Timetable
          </button>
        </div>
      </section>

      {viewMode === "daily" ? (
        <>
          {/* iPod-style player card */}
          <section className="px-6 mt-6">
            <div className="rounded-3xl bg-card border border-border p-5 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-4 relative z-10">
                <div
                  className={`w-16 h-16 rounded-xl ${featuredClass ? colorMap[featuredClass.color] : "bg-pastel-gray"} flex items-center justify-center text-2xl transition`}
                >
                  {featuredClass ? "📚" : "🎵"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">
                    {featuredClass ? featuredClass.name : "No class"}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {featuredClass
                      ? isClassActive
                        ? `In session · ${100 - progress}% remaining`
                        : isSelectedToday && progress === 100
                          ? "Completed today"
                          : "Scheduled"
                      : "Free Time"}
                  </div>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground shrink-0 flex items-center gap-1.5">
                  {featuredClass && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCourse(featuredClass);
                      }}
                      className="p-1 rounded-full bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition"
                      title="Edit Course"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  )}
                  {dayClasses.length > 0 && playerIndex !== null
                    ? `${playerIndex + 1}/${dayClasses.length}`
                    : "iPod"}
                </div>
              </div>

              <div className="mt-4 h-1.5 rounded-full bg-secondary overflow-hidden relative z-10">
                <div
                  className={`h-full bg-foreground transition-all duration-500 ${isPlaying ? "animate-pulse" : ""}`}
                  style={{ width: `${featuredClass ? progress : 0}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[10px] text-muted-foreground relative z-10">
                <span>{featuredClass ? featuredClass.startTime : "00:00"}</span>
                <span>{featuredClass ? featuredClass.endTime : "00:00"}</span>
              </div>

              <div className="mt-3 flex items-center justify-center gap-6 relative z-10">
                <button
                  onClick={handlePrev}
                  disabled={dayClasses.length <= 1}
                  className="text-foreground disabled:opacity-30 active:scale-90 transition p-1"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full bg-foreground text-primary-foreground flex items-center justify-center active:scale-95 transition hover:opacity-90"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <button
                  onClick={handleNext}
                  disabled={dayClasses.length <= 1}
                  className="text-foreground disabled:opacity-30 active:scale-90 transition p-1"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>

          {/* Day selector */}
          <section className="px-6 mt-6">
            <div className="flex justify-between">
              {dayShort.map((d, i) => {
                const date = new Date(week);
                date.setDate(week.getDate() + i);
                const active = i === selected;
                return (
                  <button
                    key={d}
                    onClick={() => setSelected(i)}
                    className={
                      "flex flex-col items-center gap-1 px-3 py-2 rounded-full transition " +
                      (active ? "bg-pastel-yellow font-semibold" : "")
                    }
                  >
                    <span className="text-xs">{d}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Class blocks */}
          <section className="px-6 mt-6 space-y-3 pb-24">
            {dayClasses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
                No classes — enjoy your free time.
              </div>
            ) : (
              dayClasses.map((c, idx) => {
                const isFeatured = idx === playerIndex;
                return (
                  <div
                    key={`${c.id}-${idx}`}
                    onClick={() => setPlayerIndex(idx)}
                    className={`rounded-2xl border p-4 cursor-pointer transition active:scale-[0.99] ${isFeatured
                        ? "border-foreground bg-card shadow-md scale-[1.01]"
                        : "border-border bg-card/60 hover:bg-card"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-semibold">{c.time}</span>
                      <div className="flex items-center gap-1.5">
                        {c.instructor && (
                          <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                            {c.instructor}
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCourse(c);
                          }}
                          className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-secondary transition shrink-0"
                          title="Edit Course"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="font-serif text-lg italic mt-1">{c.name}</div>
                    {c.room && (
                      <div className="text-xs text-muted-foreground mt-1">Room {c.room}</div>
                    )}
                  </div>
                );
              })
            )}
          </section>
        </>
      ) : (
        /* Weekly Timetable Grid View */
        <section className="px-6 mt-6 space-y-4 pb-24">
          {dayShort.map((dayName, idx) => {
            const classes = getClassesForDay(idx);
            return (
              <div
                key={dayName}
                className="rounded-3xl border border-border bg-card/40 p-4 shadow-sm"
              >
                <div className="flex justify-between items-center border-b border-border/50 pb-2 mb-3">
                  <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    {dayName}
                  </span>
                  <span className="text-[10px] font-semibold bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
                    {classes.length} class{classes.length === 1 ? "" : "es"}
                  </span>
                </div>
                {classes.length === 0 ? (
                  <div className="text-xs text-muted-foreground/50 italic py-2">
                    No classes scheduled
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {classes.map((c) => (
                      <div
                        key={`${c.id}-${c.startTime}`}
                        className={`rounded-2xl border p-3.5 flex justify-between items-center gap-3 bg-card shadow-sm ${borderColors[c.color]}`}
                      >
                        <div className="min-w-0">
                          <div className="font-serif text-base italic truncate leading-tight">
                            {c.name}
                          </div>
                          {c.room && (
                            <div className="text-[10px] opacity-80 mt-1 font-medium">
                              Room {c.room}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <div className="text-xs font-semibold text-right opacity-90">
                            {c.time}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCourse(c);
                            }}
                            className="p-1 rounded-full hover:bg-black/5 opacity-70 hover:opacity-100 transition shrink-0 text-foreground"
                            title="Edit Course"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {adding && (
        <CourseForm
          onClose={() => setAdding(false)}
          onSave={(newCourse) => {
            setCourses((prev) => [...prev, newCourse]);
            setAdding(false);
          }}
        />
      )}

      {editingCourse && (
        <CourseForm
          initial={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={(updated) => {
            setCourses((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
            setEditingCourse(null);
          }}
          onDelete={() => {
            if (confirm(`Delete "${editingCourse.name}"?`)) {
              setCourses((prev) => prev.filter((x) => x.id !== editingCourse.id));
              setEditingCourse(null);
            }
          }}
        />
      )}
    </MobileShell>
  );
}
