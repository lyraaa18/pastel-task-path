import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useTodos, useProfile, useCourses, fmtDate } from "@/lib/store";
import { Plus, ShoppingBag, ChevronDown, Trash2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — Student OS" },
      { name: "description", content: "Your daily greeting, student ID, and ongoing tasks." },
    ],
  }),
  component: Home,
});

function Home() {
  const [profile, setProfile, isProfileLoading] = useProfile();
  const [todos, setTodos, isTodosLoading] = useTodos();
  const [courses, , isCoursesLoading] = useCourses();
  const [filter, setFilter] = useState<"Ongoing" | "Done">("Ongoing");

  const isLoading = isProfileLoading || isTodosLoading || isCoursesLoading;

  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });

  const visible = todos.filter((t) => (filter === "Ongoing" ? !t.done : t.done)).slice(0, 4);

  return (
    <MobileShell isLoading={isLoading}>
      <header className="px-6 pt-10 pb-4 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl italic leading-tight">Hello, {profile.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{dateLabel}</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ShoppingBag className="w-4 h-4" strokeWidth={1.6} />
        </button>
      </header>

      {/* Student ID Card */}
      <section className="px-6">
        <div className="rounded-3xl bg-pastel-blue/60 p-5 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center text-2xl">🎓</div>
            <div className="font-serif italic text-2xl">Student ID</div>
          </div>
          <div className="border-t border-dashed border-foreground/20 my-3" />
          <div className="grid grid-cols-2 gap-y-2 text-[11px] uppercase tracking-wider">
            <div>
              <div className="text-foreground/50">Name</div>
              <div className="text-foreground font-semibold normal-case text-sm tracking-normal">{profile.name}</div>
            </div>
            <div>
              <div className="text-foreground/50">Birthday</div>
              <div className="text-foreground font-semibold text-sm tracking-normal">{profile.birthday}</div>
            </div>
            <div>
              <div className="text-foreground/50">School</div>
              <div className="text-foreground font-semibold text-sm tracking-normal">{profile.school}</div>
            </div>
            <div>
              <div className="text-foreground/50">Year level</div>
              <div className="text-foreground font-semibold text-sm tracking-normal">{profile.yearLevel}</div>
            </div>
          </div>
          <div className="mt-4 flex gap-[2px] h-8 items-end">
            {Array.from({ length: 42 }).map((_, i) => (
              <div
                key={i}
                className="bg-foreground"
                style={{ width: 2, height: `${20 + ((i * 37) % 80) * 0.15}px`, opacity: i % 3 ? 1 : 0.4 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* To-do section */}
      <section className="px-6 mt-7">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl italic">To-do</h2>
            <button
              onClick={() => setFilter(filter === "Ongoing" ? "Done" : "Ongoing")}
              className="flex items-center gap-1 text-xs bg-secondary px-3 py-1.5 rounded-full"
            >
              {filter} <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <Link
            to="/todo/new"
            className="w-9 h-9 rounded-full bg-foreground text-primary-foreground flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {visible.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-10 border border-dashed border-border rounded-2xl">
              No tasks yet. Tap + to add one.
            </div>
          )}
          {visible.map((t) => {
            const course = courses.find((c) => c.id === t.courseId);
            const labelTxt = course?.name ?? t.label;
            return (
              <Link
                key={t.id}
                to="/todo/$id"
                params={{ id: t.id }}
                className="rounded-2xl bg-card border border-border p-4 flex items-center gap-3 shadow-sm active:scale-[0.99] transition"
              >
                <div className="w-10 h-10 rounded-xl bg-pastel-yellow/60 flex items-center justify-center text-lg">📝</div>
                <div className="flex-1 min-w-0">
                  <div className={"font-medium text-sm truncate " + (t.done ? "line-through text-muted-foreground" : "")}>{t.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">
                    {labelTxt}
                    {t.deadline && (
                      <span className="text-pastel-orange ml-1">
                        | {new Date(t.deadline).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  aria-label="toggle"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setTodos((prev) => prev.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)));
                  }}
                  className={
                    "w-6 h-6 rounded-md border-2 flex items-center justify-center " +
                    (t.done ? "bg-foreground border-foreground" : "border-border")
                  }
                >
                  {t.done && <span className="text-primary-foreground text-xs">✓</span>}
                </button>
                <button
                  aria-label="delete"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm(`Delete "${t.title}"?`)) setTodos((prev) => prev.filter((x) => x.id !== t.id));
                  }}
                  className="text-muted-foreground"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Link>
            );
          })}
        </div>
      </section>
    </MobileShell>
  );
}
