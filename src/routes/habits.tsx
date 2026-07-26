import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useHabits, startOfWeek, ymd, uid, type HabitFrequency, type Habit } from "@/lib/store";
import { Plus, Clock, X, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/habits")({
  head: () => ({
    meta: [
      { title: "Habits — SYNAPSE" },
      { name: "description", content: "Track daily habits and weekly progress." },
    ],
  }),
  component: HabitsPage,
});

const dayShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekdayShort = ["S", "M", "T", "W", "T", "F", "S"];

function HabitsPage() {
  const [habits, setHabits, isLoading] = useHabits();
  const today = new Date();

  // Stateful week navigation starting from current week Monday
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => startOfWeek(today));
  const [selected, setSelected] = useState(() => ymd(today));
  const [editor, setEditor] = useState<{ open: boolean; habit?: Habit }>({ open: false });
  const [manage, setManage] = useState(false);

  // Generate 7 days relative to the selected week start
  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentWeekStart);
      d.setDate(currentWeekStart.getDate() + i);
      return d;
    });
  }, [currentWeekStart]);

  const selectedDateObject = useMemo(() => {
    return weekDates.find((d) => ymd(d) === selected) || today;
  }, [weekDates, selected, today]);

  const dateLabel = selectedDateObject.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const weekRange = useMemo(() => {
    return `${weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  }, [weekDates]);

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
    if (!h.log[ymd(d)]) {
      d.setDate(d.getDate() - 1);
    }
    while (h.log[ymd(d)]) {
      s++;
      d.setDate(d.getDate() - 1);
    }
    return s;
  };

  const toggle = (habitId: string, dateKey: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId ? { ...h, log: { ...h.log, [dateKey]: !h.log[dateKey] } } : h,
      ),
    );
  };

  const freqLabel = (h: Habit) => {
    let base = "";
    if (h.frequency === "daily") base = "Every day";
    else if (h.frequency === "weekly") base = "Weekly";
    else if (h.frequency === "monthly") base = "Monthly";
    else base = h.weekdays?.length ? h.weekdays.map((i) => weekdayShort[i]).join(" ") : "Custom";
    return h.time ? `${base} · ${h.time}` : base;
  };

  // Weekly Navigation Handlers
  const handlePrevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(prev);
    setSelected(ymd(prev)); // Automatically select the Monday of previous week
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(next);
    setSelected(ymd(next)); // Automatically select the Monday of next week
  };

  const handleGoToToday = () => {
    const start = startOfWeek(today);
    setCurrentWeekStart(start);
    setSelected(ymd(today)); // Reset back to today
  };

  // Filter habits by selected date's day index timezone-safely
  const selectedDayIndex = selectedDateObject.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const displayedHabits = manage
    ? habits
    : habits.filter((h) => {
      if (h.frequency === "custom") {
        return h.weekdays?.includes(selectedDayIndex);
      }
      return true;
    });

  const isViewingCurrentWeek = useMemo(() => {
    return currentWeekStart.toDateString() === startOfWeek(today).toDateString();
  }, [currentWeekStart, today]);

  return (
    <MobileShell isLoading={isLoading}>
      <header className="px-6 pt-10 pb-2 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl italic">Habits</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {selected === ymd(today) ? "Today" : "Selected"} • {dateLabel}
          </p>
        </div>
        <button
          onClick={() => setManage((m) => !m)}
          className={
            "text-xs px-4 py-2 rounded-full border transition " +
            (manage
              ? "bg-pastel-yellow border-pastel-yellow font-semibold scale-[1.02]"
              : "border-border text-muted-foreground hover:text-foreground bg-card/60")
          }
        >
          {manage ? "Done" : "Manage"}
        </button>
      </header>

      {/* Top Calendar navigation controls & Weekly strip */}
      <section className="px-6 mt-3">
        <div className="flex items-center justify-between mb-2.5 px-1.5">
          <button
            onClick={handlePrevWeek}
            className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground active:scale-95 transition"
            title="Previous Week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground tracking-wide">
              {weekRange}
            </span>
            {!isViewingCurrentWeek && (
              <button
                onClick={handleGoToToday}
                className="text-[9px] font-bold uppercase tracking-wider bg-secondary hover:bg-muted text-muted-foreground px-2 py-0.5 rounded-full active:scale-95 transition"
              >
                Today
              </button>
            )}
          </div>
          <button
            onClick={handleNextWeek}
            className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground active:scale-95 transition"
            title="Next Week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex justify-between bg-card/50 border border-border/80 p-2 rounded-3xl gap-1">
          {weekDates.map((d, i) => {
            const key = ymd(d);
            const active = key === selected;
            const isDayToday = key === ymd(today);
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={
                  "flex-1 flex flex-col items-center py-2 rounded-2xl transition active:scale-95 " +
                  (active
                    ? "bg-pastel-yellow font-bold text-foreground shadow-sm scale-[1.02]"
                    : isDayToday
                      ? "bg-pastel-blue/10 text-pastel-blue border border-pastel-blue/20"
                      : "text-muted-foreground hover:text-foreground")
                }
              >
                <span className="text-[9px] uppercase tracking-wider font-semibold opacity-70">
                  {dayShort[i].charAt(0)}
                </span>
                <span className="text-xs font-bold mt-1">{d.getDate()}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Habits Checklist Dashboard */}
      <section className="px-6 mt-6 space-y-5">
        {displayedHabits.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-12 border border-dashed border-border rounded-3xl bg-card/30">
            <div className="text-4xl mb-3">✨</div>
            {manage ? "No habits configured yet." : "No habits scheduled for this day."}
          </div>
        )}
        {displayedHabits.map((h) => {
          const isDoneToday = h.log[selected];

          return (
            <div
              key={h.id}
              className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4 hover:border-border/80 transition duration-200"
            >
              {/* Habit Card Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-pastel-blue/40 flex items-center justify-center text-lg shrink-0">
                    {h.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-serif italic truncate leading-tight">
                      {h.name}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                      {freqLabel(h)}
                    </div>
                  </div>
                </div>

                {manage ? (
                  /* Management Buttons */
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => setEditor({ open: true, habit: h })}
                      className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted active:scale-95 transition"
                    >
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${h.name}"?`))
                          setHabits((prev) => prev.filter((x) => x.id !== h.id));
                      }}
                      className="w-8 h-8 rounded-full bg-destructive/15 text-destructive flex items-center justify-center hover:bg-destructive/20 active:scale-95 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  /* Checking Action & Streak */
                  <div className="flex items-center gap-2.5 shrink-0">
                    {/* Streak fire widget */}
                    <div className="flex items-center gap-1 bg-pastel-orange/10 border border-pastel-orange/20 px-2.5 py-1 rounded-full text-xs font-semibold text-orange-800 select-none">
                      🔥 <span className="text-[10px] font-bold">{streak(h)}d</span>
                    </div>

                    {/* Completion Check Button */}
                    <button
                      onClick={() => toggle(h.id, selected)}
                      className={`w-9 h-9 rounded-full border transition flex items-center justify-center active:scale-90 font-bold text-xs select-none ${isDoneToday
                          ? "bg-pastel-yellow border-pastel-yellow text-foreground shadow-sm scale-105"
                          : "border-border bg-secondary/30 hover:bg-secondary/60 text-muted-foreground"
                        }`}
                    >
                      {isDoneToday ? "✓" : ""}
                    </button>
                  </div>
                )}
              </div>

              {/* Habit Card Weekly Mini Dots indicator */}
              {!manage && (
                <div className="border-t border-border/40 pt-3 flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground">
                    Weekly History
                  </span>
                  <div className="flex gap-1.5">
                    {weekDates.map((d, index) => {
                      const key = ymd(d);
                      const done = h.log[key];
                      const isDayToday = key === ymd(today);
                      const isDaySelected = key === selected;

                      return (
                        <div
                          key={key}
                          className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center transition-all ${done
                              ? "bg-pastel-yellow border-pastel-yellow/70 scale-110"
                              : isDaySelected
                                ? "border-pastel-blue bg-pastel-blue/10 scale-105"
                                : isDayToday
                                  ? "border-pastel-blue/40 bg-pastel-blue/5"
                                  : "border-border bg-secondary/30"
                            }`}
                          title={`${dayShort[index]}: ${done ? "Done" : "Todo"}`}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Progress & Add Habit Control Card */}
      <section className="px-6 mt-8 pb-12">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="font-serif text-lg italic">Weekly Completion</div>
              <div className="text-xs text-muted-foreground mt-0.5">{weekRange}</div>
            </div>
            <div className="text-3xl font-serif italic text-foreground font-bold">
              {weeklyProgress}%
            </div>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden relative">
            <div
              className="h-full bg-pastel-yellow transition-all duration-700 ease-out"
              style={{ width: `${weeklyProgress}%` }}
            />
          </div>
          <button
            onClick={() => setEditor({ open: true })}
            className="mt-6 w-full py-3.5 rounded-2xl bg-foreground text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition hover:opacity-95 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Habit
          </button>
        </div>
      </section>

      {/* Habit Form modal */}
      {editor.open && (
        <HabitEditor
          initial={editor.habit}
          onClose={() => setEditor({ open: false })}
          onSave={(h) => {
            setHabits((prev) => {
              const exists = prev.some((x) => x.id === h.id);
              return exists ? prev.map((x) => (x.id === h.id ? h : x)) : [...prev, h];
            });
            setEditor({ open: false });
          }}
          onDelete={
            editor.habit
              ? () => {
                if (confirm(`Delete "${editor.habit!.name}"?`)) {
                  setHabits((prev) => prev.filter((x) => x.id !== editor.habit!.id));
                  setEditor({ open: false });
                }
              }
              : undefined
          }
        />
      )}
    </MobileShell>
  );
}

function HabitEditor({
  initial,
  onClose,
  onSave,
  onDelete,
}: {
  initial?: Habit;
  onClose: () => void;
  onSave: (h: Habit) => void;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "✨");
  const [frequency, setFrequency] = useState<HabitFrequency>(initial?.frequency ?? "daily");
  const [weekdays, setWeekdays] = useState<number[]>(initial?.weekdays ?? []);
  const [time, setTime] = useState(initial?.time ?? "");

  const canSave = !!name.trim() && (frequency !== "custom" || weekdays.length > 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-[440px] bg-card rounded-t-[32px] p-6 max-h-[85vh] overflow-y-auto border-t border-border shadow-2xl transition-all duration-300 transform translate-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl italic">{initial ? "Edit Habit" : "New Habit"}</h2>
          <div className="flex gap-2.5">
            {onDelete && (
              <button
                onClick={onDelete}
                className="text-destructive hover:opacity-85 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center transition active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center transition active:scale-95 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-3 items-center mb-5">
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value.slice(0, 2) || "✨")}
            className="w-14 h-14 text-2xl text-center rounded-2xl border border-border bg-background outline-none font-bold"
          />
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Habit name (e.g. Morning Meditation)"
            className="flex-1 px-4 py-3.5 rounded-xl border border-border bg-background outline-none text-sm font-medium"
          />
        </div>

        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
            Frequency
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(["daily", "weekly", "monthly", "custom"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={
                  "py-2.5 rounded-xl border text-xs capitalize transition font-semibold " +
                  (frequency === f
                    ? "bg-pastel-yellow border-pastel-yellow text-foreground shadow-sm scale-[1.02]"
                    : "border-border text-muted-foreground bg-secondary/20 hover:bg-secondary/40")
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {frequency === "custom" && (
          <div className="mb-5">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">Days</div>
            <div className="flex gap-1.5 justify-between">
              {weekdayShort.map((d, i) => {
                const on = weekdays.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() =>
                      setWeekdays(on ? weekdays.filter((x) => x !== i) : [...weekdays, i].sort())
                    }
                    className={
                      "flex-1 py-2.5 rounded-xl text-xs font-bold border transition " +
                      (on
                        ? "bg-pastel-yellow border-pastel-yellow text-foreground"
                        : "border-border text-muted-foreground bg-secondary/10 hover:bg-secondary/35")
                    }
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" /> Time{" "}
            <span className="normal-case text-[10px] font-normal opacity-85">(optional)</span>
          </div>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-border bg-background outline-none text-sm font-medium"
          />
        </div>

        <button
          disabled={!canSave}
          onClick={() =>
            onSave({
              id: initial?.id ?? uid(),
              name: name.trim(),
              icon: icon || "✨",
              target:
                frequency === "custom"
                  ? weekdays.map((i) => weekdayShort[i]).join(" ")
                  : frequency.charAt(0).toUpperCase() + frequency.slice(1),
              frequency,
              weekdays: frequency === "custom" ? weekdays : undefined,
              time: time || undefined,
              log: initial?.log ?? {},
            })
          }
          className="w-full py-4 rounded-2xl bg-foreground text-primary-foreground font-semibold text-sm disabled:opacity-40 hover:opacity-95 shadow-sm active:scale-98 transition"
        >
          {initial ? "Save Changes" : "Create Habit"}
        </button>
      </div>
    </div>
  );
}
