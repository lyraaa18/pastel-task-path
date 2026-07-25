import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useCourses, type Course } from "@/lib/store";
import { Search, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { CourseForm } from "@/components/CourseForm";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — Student OS" },
      { name: "description", content: "Folder-style course library." },
    ],
  }),
  component: CoursesPage,
});

const colorMap: Record<Course["color"], string> = {
  orange: "bg-pastel-orange",
  blue: "bg-pastel-blue",
  gray: "bg-pastel-gray",
  yellow: "bg-pastel-yellow",
  pink: "bg-pastel-pink",
  green: "bg-pastel-green",
};

function CoursesPage() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [courses, setCourses, isLoading] = useCourses();
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const [manage, setManage] = useState(false);

  const isIndex = path === "/courses" || path === "/courses/";

  if (!isIndex) {
    return <Outlet />;
  }

  const filtered = courses.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <MobileShell isLoading={isLoading}>
      <header className="px-6 pt-10 pb-4 flex items-center justify-between">
        <h1 className="font-serif text-3xl italic">Courses</h1>
        <button
          onClick={() => setManage((m) => !m)}
          className={
            "text-xs px-3 py-1.5 rounded-full border " +
            (manage
              ? "bg-pastel-yellow border-pastel-yellow font-semibold"
              : "border-border text-muted-foreground")
          }
        >
          {manage ? "Done" : "Manage"}
        </button>
      </header>

      <div className="px-6">
        <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-card border border-border">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Find a course"
            className="bg-transparent outline-none text-sm flex-1"
          />
        </div>
      </div>

      <section className="px-6 mt-6 grid grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="relative">
            <Link to="/courses/$id" params={{ id: c.id }} className="block">
              <div
                className={`h-4 w-2/3 rounded-t-xl ${colorMap[c.color]} border border-b-0 border-foreground/10`}
              />
              <div
                className={`rounded-2xl rounded-tl-none ${colorMap[c.color]} aspect-square border border-foreground/10 shadow-sm flex items-end p-3`}
              >
                <span className="text-[11px] uppercase tracking-wider font-semibold bg-card/70 backdrop-blur px-2 py-1 rounded-md">
                  {c.name}
                </span>
              </div>
            </Link>
            {manage && (
              <button
                onClick={() => {
                  if (confirm(`Delete "${c.name}"? Tasks linked to it will keep their label.`)) {
                    setCourses((prev) => prev.filter((x) => x.id !== c.id));
                  }
                }}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </section>

      <button
        onClick={() => setAdding(true)}
        className="fixed bottom-24 right-6 sm:right-[calc(50%-200px)] w-14 h-14 rounded-full bg-foreground text-primary-foreground flex items-center justify-center shadow-lg z-30"
      >
        <Plus className="w-6 h-6" />
      </button>

      {adding && (
        <CourseForm
          onClose={() => setAdding(false)}
          onSave={(c) => {
            setCourses((prev) => [...prev, c]);
            setAdding(false);
          }}
        />
      )}
    </MobileShell>
  );
}
