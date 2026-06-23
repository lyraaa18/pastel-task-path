import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useTodos } from "@/lib/store";
import { useState } from "react";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar — Student OS" }, { name: "description", content: "Month view of your tasks." }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const [todos] = useTodos();
  const [cursor, setCursor] = useState(new Date());

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

  return (
    <MobileShell>
      <header className="px-6 pt-10 pb-4 flex items-center justify-between">
        <h1 className="font-serif text-3xl italic">Calendar</h1>
      </header>

      <div className="px-6 flex items-center justify-between">
        <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="px-3 py-1 rounded-full bg-secondary text-sm">‹</button>
        <span className="font-semibold">{monthLabel}</span>
        <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="px-3 py-1 rounded-full bg-secondary text-sm">›</button>
      </div>

      <div className="px-6 mt-5 grid grid-cols-7 gap-1 text-center text-[10px] uppercase text-muted-foreground">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="px-6 mt-1 grid grid-cols-7 gap-1">
        {cells.map((c, i) => {
          const today = new Date();
          const isToday =
            c &&
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === c;
          return (
            <div
              key={i}
              className={
                "aspect-square rounded-xl flex flex-col items-center justify-center text-sm " +
                (c ? "border border-border " : "") +
                (isToday ? "bg-pastel-yellow font-semibold " : "bg-card ")
              }
            >
              {c && (
                <>
                  <span>{c}</span>
                  {tasksByDay[c] && <span className="text-[9px] text-pastel-orange font-bold">●</span>}
                </>
              )}
            </div>
          );
        })}
      </div>
    </MobileShell>
  );
}
