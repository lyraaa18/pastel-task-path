import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useCourses, startOfWeek, type Course } from "@/lib/store";
import { Plus, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { useState, useEffect } from "react";
import { CourseForm } from "@/components/CourseForm";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [{ title: "Class Schedule — Student OS" }, { name: "description", content: "Your weekly class schedule." }],
  }),
  component: SchedulePage,
});

const dayShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dayKey = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const colorMap: Record<Course["color"], string> = {
  orange: "bg-pastel-orange",
  blue: "bg-pastel-blue",
  gray: "bg-pastel-gray",
  yellow: "bg-pastel-yellow",
  pink: "bg-pastel-pink",
  green: "bg-pastel-green",
};

function SchedulePage() {
  const [courses, setCourses, isLoading] = useCourses();
  const today = new Date();
  const week = startOfWeek(today);
  const [selected, setSelected] = useState((today.getDay() + 6) % 7);
  const [adding, setAdding] = useState(false);
  const [playerIndex, setPlayerIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const dateLabel = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const isSelectedToday = selected === (today.getDay() + 6) % 7;

  // Resolve matching schedules for the selected day (0=Mon, ..., 6=Sun)
  const dayClasses = courses
    .flatMap((c) => {
      // Skema baru: schedules
      if (c.schedules && c.schedules.length > 0) {
        return c.schedules
          .filter((s) => s.days.includes(selected))
          .map((s) => ({
            ...c,
            time: `${s.start} - ${s.end}`,
            startTime: s.start,
            endTime: s.end,
          }));
      }
      // Fallback: legacy day/time
      if (c.day && (c.day.includes(dayKey[selected]) || c.day === dayKey[selected])) {
        const [start = "09:00", end = "10:30"] = c.time ? c.time.split(" - ") : [];
        return [
          {
            ...c,
            startTime: start,
            endTime: end,
          },
        ];
      }
      return [];
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

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
        (c) => c.startTime <= nowTimeStr && nowTimeStr <= c.endTime
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
  }, [selected, dayClasses.length, isSelectedToday]);

  const featuredClass = playerIndex !== null && dayClasses[playerIndex] ? dayClasses[playerIndex] : undefined;

  const getProgress = (c: typeof dayClasses[0]) => {
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

  const isClassActive = featuredClass && isSelectedToday && (() => {
    const nowHours = new Date().getHours();
    const nowMins = new Date().getMinutes();
    const nowTimeStr = `${String(nowHours).padStart(2, "0")}:${String(nowMins).padStart(2, "0")}`;
    return featuredClass.startTime <= nowTimeStr && nowTimeStr <= featuredClass.endTime;
  })();

  const progress = featuredClass
    ? isClassActive
      ? getProgress(featuredClass)
      : isSelectedToday && new Date().getHours() * 60 + new Date().getMinutes() > featuredClass.endTime.split(":").map(Number)[0] * 60 + featuredClass.endTime.split(":").map(Number)[1]
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

      {/* iPod-style player card */}
      <section className="px-6 mt-6">
        <div className="rounded-3xl bg-card border border-border p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className={`w-16 h-16 rounded-xl ${featuredClass ? colorMap[featuredClass.color] : "bg-pastel-gray"} flex items-center justify-center text-2xl transition`}>
              {featuredClass ? "📚" : "🎵"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{featuredClass ? featuredClass.name : "No class"}</div>
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
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground shrink-0">
              {dayClasses.length > 0 && playerIndex !== null ? `${playerIndex + 1}/${dayClasses.length}` : "iPod"}
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
                className={`rounded-2xl border p-4 cursor-pointer transition active:scale-[0.99] ${
                  isFeatured 
                    ? "border-foreground bg-card shadow-md scale-[1.01]" 
                    : "border-border bg-card/60 hover:bg-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-semibold">{c.time}</span>
                  {c.instructor && <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{c.instructor}</span>}
                </div>
                <div className="font-serif text-lg italic mt-1">{c.name}</div>
                {c.room && <div className="text-xs text-muted-foreground mt-1">Room {c.room}</div>}
              </div>
            );
          })
        )}
      </section>

      {adding && (
        <CourseForm
          onClose={() => setAdding(false)}
          onSave={(newCourse) => {
            setCourses((prev) => [...prev, newCourse]);
            setAdding(false);
          }}
        />
      )}
    </MobileShell>
  );
}
