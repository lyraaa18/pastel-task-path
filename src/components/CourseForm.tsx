import { useState } from "react";
import { ChevronDown, Plus, Trash2, Clock, X } from "lucide-react";
import { uid, DAY_LABELS, type Course, type CourseSchedule } from "@/lib/store";

const colorMap: Record<Course["color"], string> = {
  orange: "bg-pastel-orange",
  blue: "bg-pastel-blue",
  gray: "bg-pastel-gray",
  yellow: "bg-pastel-yellow",
  pink: "bg-pastel-pink",
  green: "bg-pastel-green",
};
const colorChoices: Course["color"][] = ["orange", "blue", "gray", "yellow", "pink", "green"];

export function CourseForm({
  initial,
  onClose,
  onSave,
  onDelete,
}: {
  initial?: Course;
  onClose: () => void;
  onSave: (c: Course) => void;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [color, setColor] = useState<Course["color"]>(initial?.color ?? "orange");
  const [instructor, setInstructor] = useState(initial?.instructor ?? "");
  const [room, setRoom] = useState(initial?.room ?? "");

  // Initialize schedules array - default to empty if new course, or initial schedules if editing
  const [schedules, setSchedules] = useState<CourseSchedule[]>(
    initial?.schedules || []
  );

  const updateSch = (id: string, patch: Partial<CourseSchedule>) =>
    setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  
  const toggleDay = (id: string, d: number) =>
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              days: s.days.includes(d) ? s.days.filter((x) => x !== d) : [...s.days, d].sort(),
            }
          : s,
      ),
    );

  const canSave = name.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-[440px] bg-card rounded-t-3xl max-h-[92vh] overflow-y-auto border-t border-border shadow-2xl transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 bg-card/95 backdrop-blur px-6 pt-6 pb-3 flex items-center justify-between border-b border-border/50 z-10">
          <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-secondary transition active:scale-95">
            <ChevronDown className="w-5 h-5" />
          </button>
          <h2 className="font-serif text-xl italic">{initial ? "Edit Course" : "New Course"}</h2>
          {onDelete ? (
            <button type="button" onClick={onDelete} className="text-destructive p-1 rounded-full hover:bg-destructive/10 transition active:scale-95">
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-5" />
          )}
        </header>

        <div className="px-6 pt-5 pb-8 space-y-5">
          {/* Folder preview */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                className={`h-5 w-24 rounded-t-xl ${colorMap[color]} border border-b-0 border-foreground/10`}
              />
              <div
                className={`w-40 h-32 rounded-2xl rounded-tl-none ${colorMap[color]} border border-foreground/10 shadow-sm`}
              />
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Color</div>
            <div className="flex gap-2 justify-center">
              {colorChoices.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full ${colorMap[c]} border-2 ${color === c ? "border-foreground scale-110" : "border-transparent"} transition active:scale-95`}
                />
              ))}
            </div>
          </div>

          <Field label="Course Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Calculus II"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-sm font-semibold"
            />
          </Field>

          <Field label="Instructor">
            <input
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              placeholder="e.g. Prof. Davis (Optional)"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-sm font-semibold"
            />
          </Field>

          <Field label="Room Location">
            <input
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. Hall C-3 (Optional)"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-sm font-semibold"
            />
          </Field>

          {/* Schedules list container */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-t border-border/40 pt-4">
              <span className="text-sm font-semibold">Class Schedules</span>
              {schedules.length === 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setSchedules([{ id: uid(), days: [], start: "", end: "" }])
                  }
                  className="text-xs font-bold bg-secondary hover:bg-muted text-foreground px-3.5 py-1.5 rounded-full active:scale-95 transition"
                >
                  + Add Schedule
                </button>
              )}
            </div>

            {schedules.length > 0 && (
              <div className="space-y-4">
                {schedules.map((s, idx) => (
                  <div key={s.id} className="space-y-3 p-4 rounded-2xl border border-border bg-secondary/15 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Schedule #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSchedules((prev) => prev.filter((x) => x.id !== s.id))}
                        className="w-6 h-6 rounded-full bg-secondary/40 hover:bg-destructive/15 text-muted-foreground hover:text-destructive flex items-center justify-center transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    {/* Weekday Selector */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Days</div>
                      <div className="flex gap-1.5">
                        {DAY_LABELS.map((d, i) => {
                          const on = s.days.includes(i);
                          return (
                            <button
                              type="button"
                              key={i}
                              onClick={() => toggleDay(s.id, i)}
                              className={
                                "flex-1 py-2 rounded-xl text-xs font-bold border transition " +
                                (on
                                  ? "bg-pastel-yellow border-pastel-yellow text-foreground shadow-sm scale-[1.02]"
                                  : "border-border text-muted-foreground bg-background hover:bg-secondary/30")
                              }
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Inputs */}
                    <div className="flex gap-2">
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Start</div>
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-background">
                          <Clock className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.8} />
                          <input
                            type="time"
                            value={s.start}
                            onChange={(e) => updateSch(s.id, { start: e.target.value })}
                            className="w-full min-w-0 bg-transparent outline-none text-sm font-bold"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">End</div>
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-background">
                          <Clock className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.8} />
                          <input
                            type="time"
                            value={s.end}
                            onChange={(e) => updateSch(s.id, { end: e.target.value })}
                            className="w-full min-w-0 bg-transparent outline-none text-sm font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setSchedules((prev) => [...prev, { id: uid(), days: [], start: "", end: "" }])
                  }
                  className="w-full py-3 rounded-2xl border border-dashed border-border text-xs font-bold text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 hover:bg-secondary/10 transition active:scale-[0.98]"
                >
                  + Add Another Time Slot
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={!canSave}
            onClick={() => {
              const cleanedSchedules = schedules.filter(
                (s) => s.days.length && s.start && s.end
              );
              onSave({
                id: initial?.id ?? uid(),
                name: name.trim(),
                color,
                instructor: instructor.trim() || undefined,
                room: room.trim() || undefined,
                schedules: cleanedSchedules.length ? cleanedSchedules : undefined,
              });
            }}
            className="w-full py-4 rounded-2xl bg-foreground text-primary-foreground font-semibold text-sm disabled:opacity-40 hover:opacity-95 shadow-sm active:scale-98 transition z-10"
          >
            {initial ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-semibold mb-2">{label}</div>
      {children}
    </div>
  );
}
