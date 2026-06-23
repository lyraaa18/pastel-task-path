import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useHabits, startOfWeek, ymd, uid } from "@/lib/store";
import { Plus, MoreVertical } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/habits")({
  head: () => ({
    meta: [{ title: "Habits — Student OS" }, { name: "description", content: "Track daily habits and weekly progress." }],
  }),
  component: HabitsPage,
});

const dayShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function HabitsPage() {
  const [habits, setHabits] = useHabits();
  const today = new Date();
  const week = startOfWeek(today);
  const [selected, setSelected] = useState(ymd(today));
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(week);
    d.setDate(week.getDate() + i);
    return d;
  });

  const dateLabel = today.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  const weekRange = `${weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  const weeklyProgress = useMemo(() => {
    const total = habits.length * 7;
    if (!total) return 0;
    let done = 0;
    habits.forEach((h) => {
      weekDates.forEach((d) => {
        if (h.log[ymd(d)]) done++;
      });
    });
    return Math.round((done / total) * 100);
  }, [habits, weekDates]);

  const streak = (h: { log: Record<string, boolean> }) => {
    let s = 0;
    const d = new Date(today);
    while (h.log[ymd(d)]) {
      s++;
      d.setDate(d.getDate() - 1);
    }
    return s;
  };

  const toggle = (habitId: string, dateKey: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, log: { ...h.log, [dateKey]: !h.log[dateKey] } } : h))
    );
  };

  return (
    <MobileShell>
      <header className="px-6 pt-10 pb-2 flex items-center justify-between">
        <h1 className="font-serif text-3xl italic">Habits</h1>
        <button><MoreVertical className="w-5 h-5" /></button>
      </header>

      <div className="px-6">
        <p className="text-sm text-muted-foreground">Today • {dateLabel}</p>

        <div className="mt-4 flex justify-between">
          {weekDates.map((d, i) => {
            const key = ymd(d);
            const active = key === selected;
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={
                  "flex flex-col items-center w-10 py-2 rounded-2xl transition " +
                  (active ? "bg-pastel-yellow font-semibold" : "")
                }
              >
                <span className="text-[10px] uppercase">{dayShort[i]}</span>
                <span className="text-sm mt-0.5">{d.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      <section className="px-6 mt-6 space-y-4">
        {habits.map((h) => (
          <div key={h.id} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pastel-blue/50 flex items-center justify-center text-lg">{h.icon}</div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{h.name}</div>
              <div className="text-xs text-muted-foreground">{h.target}</div>
            </div>
            <div className="flex gap-1">
              {weekDates.map((d) => {
                const key = ymd(d);
                const done = h.log[key];
                return (
                  <button
                    key={key}
                    onClick={() => toggle(h.id, key)}
                    className={
                      "w-3 h-3 rounded-full border " +
                      (done ? "bg-pastel-yellow border-pastel-yellow" : "border-foreground/30")
                    }
                    aria-label={key}
                  />
                );
              })}
            </div>
            <div className="text-[10px] text-muted-foreground w-10 text-right">
              Streak<br /><span className="text-foreground font-semibold text-sm">{streak(h)}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="px-6 mt-8">
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="font-serif text-lg italic">Weekly Progress</div>
            <div className="text-xs text-muted-foreground">{weekRange}</div>
          </div>
          <div className="text-2xl font-semibold">{weeklyProgress}%</div>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div className="h-full bg-pastel-yellow transition-all" style={{ width: `${weeklyProgress}%` }} />
        </div>
        <button
          onClick={() => setAdding(true)}
          className="mt-6 w-full py-3 rounded-xl bg-pastel-yellow font-semibold text-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Habit
        </button>
      </section>

      {adding && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-end justify-center" onClick={() => setAdding(false)}>
          <div className="w-full max-w-[440px] bg-card rounded-t-3xl p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-2xl italic mb-4">New Habit</h2>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Habit name"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-sm"
            />
            <button
              disabled={!name.trim()}
              onClick={() => {
                setHabits((prev) => [...prev, { id: uid(), name: name.trim(), icon: "✨", target: "Daily", log: {} }]);
                setName("");
                setAdding(false);
              }}
              className="mt-4 w-full py-3 rounded-xl bg-foreground text-primary-foreground font-semibold text-sm disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
