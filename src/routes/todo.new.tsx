import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useTodos, useCourses, uid } from "@/lib/store";
import { ChevronDown, Plus, X, Image as ImgIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/todo/new")({
  validateSearch: z.object({ courseId: z.string().optional() }),
  head: () => ({ meta: [{ title: "New To-do" }] }),
  component: NewTodo,
});

function NewTodo() {
  const nav = useNavigate();
  const { courseId } = Route.useSearch();
  const [, setTodos] = useTodos();
  const [courses] = useCourses();

  const [title, setTitle] = useState("");
  const [labelMode, setLabelMode] = useState<"Custom" | "Course">(courseId ? "Course" : "Custom");
  const [selectedCourse, setSelectedCourse] = useState<string>(courseId ?? "");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState<{ id: string; title: string }[]>([]);
  const [newSub, setNewSub] = useState("");
  const [deadlineOn, setDeadlineOn] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("07:37");

  const create = () => {
    if (!title.trim()) return;
    const labelText = labelMode === "Course" ? (courses.find((c) => c.id === selectedCourse)?.name ?? "Course") : "Custom";
    setTodos((prev) => [
      {
        id: uid(),
        title: title.trim(),
        label: labelText,
        courseId: labelMode === "Course" ? selectedCourse : undefined,
        description,
        subtasks: subtasks.map((s) => ({ ...s, done: false })),
        deadline: deadlineOn ? new Date(`${date}T${time}`).toISOString() : undefined,
        done: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    nav({ to: "/" });
  };

  return (
    <MobileShell>
      <header className="px-6 pt-10 pb-4 flex items-center justify-between">
        <button onClick={() => nav({ to: "/" })} className="w-9 h-9 rounded-full flex items-center justify-center">
          <ChevronDown className="w-5 h-5" />
        </button>
        <h1 className="font-serif text-2xl italic">New To-do</h1>
        <div className="w-9" />
      </header>

      <div className="px-6 flex justify-center">
        <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center">
          <ImgIcon className="w-7 h-7 text-muted-foreground" strokeWidth={1.4} />
        </div>
      </div>

      <div className="px-6 mt-6 space-y-5">
        <Field label="To-do">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter to-do"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-sm"
          />
        </Field>

        <Field label="Label">
          <div className="flex gap-2">
            {(["Custom", "Course"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setLabelMode(m)}
                className={
                  "flex-1 py-2.5 rounded-xl border text-sm " +
                  (labelMode === m ? "bg-pastel-yellow border-pastel-yellow font-semibold" : "border-border")
                }
              >
                {m}
              </button>
            ))}
          </div>
          {labelMode === "Course" && (
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="mt-3 w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-sm"
            >
              <option value="">Select a label</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </Field>

        <Field label={<span className="flex items-center gap-2">Subto-dos <button onClick={() => newSub && setSubtasks([...subtasks, { id: uid(), title: newSub }]) || setNewSub("")} className="text-xs px-2 py-0.5 rounded-full bg-pastel-yellow font-semibold">Plus</button></span>}>
          <div className="flex gap-2">
            <input
              value={newSub}
              onChange={(e) => setNewSub(e.target.value)}
              placeholder="Add subtask"
              className="flex-1 px-4 py-2 rounded-xl border border-border bg-background outline-none text-sm"
            />
            <button onClick={() => { if (newSub.trim()) { setSubtasks([...subtasks, { id: uid(), title: newSub.trim() }]); setNewSub(""); } }} className="px-3 rounded-xl bg-secondary"><Plus className="w-4 h-4" /></button>
          </div>
          {subtasks.length > 0 && (
            <ul className="mt-2 space-y-1">
              {subtasks.map((s) => (
                <li key={s.id} className="flex items-center gap-2 text-sm">
                  <span className="flex-1">• {s.title}</span>
                  <button onClick={() => setSubtasks(subtasks.filter((x) => x.id !== s.id))}><X className="w-3 h-3" /></button>
                </li>
              ))}
            </ul>
          )}
        </Field>

        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-sm resize-none"
          />
        </Field>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Deadline</span>
            <button
              onClick={() => setDeadlineOn(!deadlineOn)}
              className={"w-11 h-6 rounded-full transition relative " + (deadlineOn ? "bg-pastel-green" : "bg-secondary")}
            >
              <span className={"absolute top-0.5 w-5 h-5 rounded-full bg-card transition " + (deadlineOn ? "left-[22px]" : "left-0.5")} />
            </button>
          </div>
          {deadlineOn && (
            <div className="flex gap-2">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-border bg-background outline-none text-sm" />
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-28 px-3 py-2 rounded-xl border border-border bg-background outline-none text-sm" />
            </div>
          )}
          <p className="text-[10px] text-muted-foreground mt-2">You will be notified a day before the deadline</p>
        </div>

        <button
          onClick={create}
          disabled={!title.trim()}
          className="w-full py-3 rounded-xl bg-foreground text-primary-foreground font-semibold text-sm disabled:opacity-40 mt-4"
        >
          Create
        </button>
      </div>
    </MobileShell>
  );
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-semibold mb-2">{label}</div>
      {children}
    </div>
  );
}
