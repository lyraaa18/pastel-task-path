import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useCourses, startOfWeek } from "@/lib/store";
import { Plus, Play, SkipBack, SkipForward } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [{ title: "Class Schedule — Student OS" }, { name: "description", content: "Your weekly class schedule." }],
  }),
  component: SchedulePage,
});

const dayShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dayKey = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function SchedulePage() {
  const [courses] = useCourses();
  const today = new Date();
  const week = startOfWeek(today);
  const [selected, setSelected] = useState((today.getDay() + 6) % 7);

  const dateLabel = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const dayClasses = courses.filter((c) => c.day === dayKey[selected]);

  return (
    <MobileShell>
      <header className="px-6 pt-10 pb-2 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl italic">Class Schedule</h1>
          <p className="text-sm text-muted-foreground mt-1">{dateLabel}</p>
        </div>
        <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
          <Plus className="w-5 h-5" />
        </button>
      </header>

      {/* iPod-style player card */}
      <section className="px-6 mt-6">
        <div className="rounded-3xl bg-card border border-border p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-pastel-gray flex items-center justify-center text-2xl">🎵</div>
            <div className="flex-1">
              <div className="font-semibold">{dayClasses.length ? dayClasses[0].name : "No class"}</div>
              <div className="text-xs text-muted-foreground">{dayClasses.length ? dayClasses[0].time : "Free Time"}</div>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Schedule</div>
          </div>
          <div className="mt-4 h-1 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-foreground/60 w-1/3" />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>00:00</span>
            <span>00:00</span>
          </div>
          <div className="mt-3 flex items-center justify-center gap-6">
            <SkipBack className="w-5 h-5" />
            <button className="w-12 h-12 rounded-full bg-foreground text-primary-foreground flex items-center justify-center">
              <Play className="w-5 h-5 ml-0.5" />
            </button>
            <SkipForward className="w-5 h-5" />
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
      <section className="px-6 mt-6 space-y-3">
        {dayClasses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            No classes — enjoy your free time.
          </div>
        ) : (
          dayClasses.map((c) => (
            <div key={c.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="text-xs text-muted-foreground">{c.time}</div>
              <div className="font-serif text-lg italic mt-1">{c.name}</div>
              <div className="text-xs text-muted-foreground mt-1">Room {c.room}</div>
            </div>
          ))
        )}
      </section>
    </MobileShell>
  );
}
