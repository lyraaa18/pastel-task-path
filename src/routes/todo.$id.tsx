import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useTodos, useCourses } from "@/lib/store";
import { ChevronLeft, Trash2, Calendar, Tag, Pencil } from "lucide-react";

export const Route = createFileRoute("/todo/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Task — SYNAPSE` }, { name: "description", content: `Task ${params.id}` }],
  }),
  component: TodoDetail,
});

function TodoDetail() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const [todos, setTodos, isTodosLoading] = useTodos();
  const [courses, , isCoursesLoading] = useCourses();

  const isLoading = isTodosLoading || isCoursesLoading;

  if (isLoading) {
    return (
      <MobileShell isLoading={true}>
        <div>Loading...</div>
      </MobileShell>
    );
  }

  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return (
      <MobileShell>
        <div className="p-10 text-center text-muted-foreground">
          Task not found.
          <button onClick={() => nav({ to: "/" })} className="block mx-auto mt-4 text-sm underline">
            Back home
          </button>
        </div>
      </MobileShell>
    );
  }

  const course = courses.find((c) => c.id === todo.courseId);
  const labelTxt = course?.name ?? todo.label;

  const toggleMain = () =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const toggleSub = (sid: string) =>
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, subtasks: t.subtasks.map((s) => (s.id === sid ? { ...s, done: !s.done } : s)) }
          : t,
      ),
    );

  const remove = () => {
    if (!confirm(`Delete "${todo.title}"?`)) return;
    setTodos((prev) => prev.filter((t) => t.id !== id));
    nav({ to: "/" });
  };

  return (
    <MobileShell>
      <header className="px-6 pt-10 pb-4 flex items-center justify-between">
        <button
          onClick={() => nav({ to: "/" })}
          className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-serif text-xl italic">Task</h1>
        <div className="flex gap-2">
          <Link
            to="/todo/new"
            search={{ edit: todo.id }}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            onClick={remove}
            className="w-9 h-9 rounded-full bg-destructive/15 text-destructive flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="px-6 pb-10">
        <div className="rounded-3xl bg-pastel-yellow/50 border border-border p-5">
          <div className="flex items-start gap-3">
            <button
              onClick={toggleMain}
              className={
                "mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 " +
                (todo.done ? "bg-foreground border-foreground" : "border-foreground/40")
              }
            >
              {todo.done && <span className="text-primary-foreground text-xs">✓</span>}
            </button>
            <div className="flex-1">
              <div
                className={
                  "font-serif text-2xl italic " +
                  (todo.done ? "line-through text-muted-foreground" : "")
                }
              >
                {todo.title}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Label</span>
            <span className="ml-auto font-medium">{labelTxt}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Deadline</span>
            <span className="ml-auto font-medium">
              {todo.deadline
                ? new Date(todo.deadline).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : "No deadline"}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Description
          </div>
          <div className="rounded-2xl border border-border p-4 text-sm min-h-[80px] whitespace-pre-wrap">
            {todo.description || <span className="text-muted-foreground">No description.</span>}
          </div>
        </div>

        <div className="mt-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Subtasks ({todo.subtasks.filter((s) => s.done).length}/{todo.subtasks.length})
          </div>
          {todo.subtasks.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">No subtasks.</div>
          ) : (
            <ul className="space-y-2">
              {todo.subtasks.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center gap-3 rounded-xl border border-border p-3"
                >
                  <button
                    onClick={() => toggleSub(s.id)}
                    className={
                      "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 " +
                      (s.done ? "bg-foreground border-foreground" : "border-foreground/40")
                    }
                  >
                    {s.done && <span className="text-primary-foreground text-[10px]">✓</span>}
                  </button>
                  <span
                    className={"text-sm " + (s.done ? "line-through text-muted-foreground" : "")}
                  >
                    {s.title}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </MobileShell>
  );
}
