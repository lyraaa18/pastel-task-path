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
  const [hasSchedule, setHasSchedule] = useState((initial?.schedules?.length ?? 0) > 0);
  const [schedules, setSchedules] = useState<CourseSchedule[]>(
    initial?.schedules?.length ? initial.schedules : [{ id: uid(), days: [], start: "", end: "" }]
  );

  const updateSch = (id: string, patch: Partial<CourseSchedule>) =>
    setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const toggleDay = (id: string, d: number) =>
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, days: s.days.includes(d) ? s.days.filter((x) => x !== d) : [...s.days, d].sort() }
          : s
      )
    );

  const canSave = name.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={onClose}>
      <div
        className="w-full max-w-[440px] bg-card rounded-t-3xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 bg-card px-6 pt-6 pb-3 flex items-center justify-between border-b border-border/50">
          <button onClick={onClose}><ChevronDown className="w-5 h-5" /></button>
          <h2 className="font-serif text-xl italic">{initial ? "Edit Course" : "New Course"}</h2>
          {onDelete ? (
            <button onClick={onDelete} className="text-destructive"><Trash2 className="w-4 h-4" /></button>
          ) : <div className="w-5" />}
        </header>

        <div className="px-6 pt-5 pb-8 space-y-5">
          {/* Folder preview */}
          <div className="flex justify-center">
            <div className="relative">
              <div className={`h-5 w-24 rounded-t-xl ${colorMap[color]} border border-b-0 border-foreground/10`} />
              <div className={`w-40 h-32 rounded-2xl rounded-tl-none ${colorMap[color]} border border-foreground/10 shadow-sm`} />
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Color</div>
            <div className="flex gap-2 justify-center">
              {colorChoices.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full ${colorMap[c]} border-2 ${color === c ? "border-foreground" : "border-transparent"}`}
                />
              ))}
            </div>
          </div>

          <Field label="Course">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter course name"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-sm"
            />
          </Field>

          <Field label="Instructor">
            <input
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              placeholder="Enter instructor's name (Optional)"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-sm"
            />
          </Field>

          <Field label="Room Location">
            <input
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Enter room location (Optional)"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-sm"
            />
          </Field>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Assign schedules to this course</span>
              <button
                onClick={() => setHasSchedule(!hasSchedule)}
                className={"w-11 h-6 rounded-full transition relative " + (hasSchedule ? "bg-pastel-green" : "bg-secondary")}
              >
                <span className={"absolute top-0.5 w-5 h-5 rounded-full bg-card transition " + (hasSchedule ? "left-[22px]" : "left-0.5")} />
              </button>
            </div>

            {hasSchedule && (
              <div className="space-y-4">
                {schedules.map((s, idx) => (
                  <div key={s.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">Schedule {idx + 1}</span>
                      {schedules.length > 1 && (
                        <button
                          onClick={() => setSchedules((prev) => prev.filter((x) => x.id !== s.id))}
                          className="text-muted-foreground"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      {DAY_LABELS.map((d, i) => {
                        const on = s.days.includes(i);
                        return (
                          <button
                            key={i}
                            onClick={() => toggleDay(s.id, i)}
                            className={
                              "flex-1 py-1.5 rounded-lg text-[11px] font-medium border " +
                              (on ? "bg-pastel-yellow border-pastel-yellow" : "border-border text-muted-foreground")
                            }
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-border">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <input
                          type="time"
                          value={s.start}
                          onChange={(e) => updateSch(s.id, { start: e.target.value })}
                          placeholder="Start Time"
                          className="flex-1 bg-transparent outline-none text-sm"
                        />
                      </div>
                      <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-border">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <input
                          type="time"
                          value={s.end}
                          onChange={(e) => updateSch(s.id, { end: e.target.value })}
                          placeholder="End Time"
                          className="flex-1 bg-transparent outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground">
                    You will be notified 15 minutes before schedule starts
                  </p>
                  <button
                    onClick={() => setSchedules((prev) => [...prev, { id: uid(), days: [], start: "", end: "" }])}
                    className="w-9 h-9 rounded-full bg-foreground text-primary-foreground flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            disabled={!canSave}
            onClick={() => {
              const cleanedSchedules = hasSchedule
                ? schedules.filter((s) => s.days.length && s.start && s.end)
                : [];
              const first = cleanedSchedules[0];
              onSave({
                id: initial?.id ?? uid(),
                name: name.trim(),
                color,
                instructor: instructor.trim() || undefined,
                room: room.trim() || undefined,
                schedules: cleanedSchedules.length ? cleanedSchedules : undefined,
                day: first ? first.days.map((d) => DAY_LABELS[d].toUpperCase().slice(0, 3)).join("/") : undefined,
                time: first ? `${first.start} - ${first.end}` : undefined,
              });
            }}
            className="w-full py-3 rounded-xl bg-foreground text-primary-foreground font-semibold text-sm disabled:opacity-40"
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
