import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useTodos, useCourses, ymd } from "@/lib/store";
import { useState } from "react";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — SYNAPSE" },
      { name: "description", content: "Month view of your tasks." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const [todos, , isTodosLoading] = useTodos();
  const [courses, , isCoursesLoading] = useCourses();
  const isLoading = isTodosLoading || isCoursesLoading;
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState<string>(ymd(new Date()));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const startDay = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const tasksByDay: Record<number, number> = {};
  todos.forEach((t) => {
    if (!t.deadline) return;
    const d = new Date(t.deadline);
    if (d.getFullYear() === year && d.getMonth() === month) {
      tasksByDay[d.getDate()] = (tasksByDay[d.getDate()] || 0) + 1;
    }
  });

  const selectedTasks = todos
    .filter((t) => t.deadline && ymd(new Date(t.deadline)) === selected)
    .sort((a, b) => +new Date(a.deadline!) - +new Date(b.deadline!));

  const selectedLabel = new Date(selected).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <MobileShell isLoading={isLoading}>
      <header className="px-6 pt-10 pb-4 flex items-center justify-between">
        <h1 className="font-serif text-3xl italic">Calendar</h1>
      </header>

      <div className="px-6 flex items-center justify-between">
        <button
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="px-3 py-1 rounded-full bg-secondary text-sm"
        >
          ‹
        </button>
        <span className="font-semibold">{monthLabel}</span>
        <button
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          className="px-3 py-1 rounded-full bg-secondary text-sm"
        >
          ›
        </button>
      </div>

      <div className="px-6 mt-5 grid grid-cols-7 gap-1 text-center text-[10px] uppercase text-muted-foreground">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="px-6 mt-1 grid grid-cols-7 gap-1">
        {cells.map((c, i) => {
          if (!c) return <div key={i} />;
          const key = ymd(new Date(year, month, c));
          const today = new Date();
          const isToday =
            today.getFullYear() === year && today.getMonth() === month && today.getDate() === c;
          const isSel = key === selected;
          return (
            <button
              key={i}
              onClick={() => setSelected(key)}
              className={
                "aspect-square rounded-xl flex flex-col items-center justify-center text-sm border " +
                (isSel
                  ? "border-foreground bg-pastel-yellow font-semibold "
                  : isToday
                    ? "border-border bg-pastel-yellow/40 font-semibold "
                    : "border-border bg-card ")
              }
            >
              <span>{c}</span>
              {tasksByDay[c] && (
                <span className="text-[9px] text-pastel-orange font-bold leading-none">●</span>
              )}
            </button>
          );
        })}
      </div>

      <section className="px-6 mt-6 pb-10">
        <div className="font-serif text-lg italic mb-3">{selectedLabel}</div>
        {selectedTasks.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-6 border border-dashed border-border rounded-2xl">
            No deadlines on this day.
          </div>
        ) : (
          <div className="space-y-2">
            {selectedTasks.map((t) => {
              const course = courses.find((c) => c.id === t.courseId);
              return (
                <Link
                  key={t.id}
                  to="/todo/$id"
                  params={{ id: t.id }}
                  className="rounded-2xl bg-card border border-border p-3 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-pastel-yellow/60 flex items-center justify-center">
                    📝
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={
                        "text-sm font-medium truncate " +
                        (t.done ? "line-through text-muted-foreground" : "")
                      }
                    >
                      {t.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {course?.name ?? t.label}
                      <span className="text-pastel-orange ml-1">
                        ·{" "}
                        {new Date(t.deadline!).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </MobileShell>
  );
}
