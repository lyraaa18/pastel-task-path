import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useCourses, uid, type Course } from "@/lib/store";
import { Search, Plus, MoreVertical } from "lucide-react";
import { useState } from "react";

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

const colorChoices: Course["color"][] = ["orange", "blue", "gray", "yellow", "pink", "green"];

function CoursesPage() {
  const [courses, setCourses] = useCourses();
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState<Course["color"]>("orange");

  const filtered = courses.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <MobileShell>
      <header className="px-6 pt-10 pb-4 flex items-center justify-between">
        <h1 className="font-serif text-3xl italic">Courses</h1>
        <button className="w-9 h-9 rounded-full flex items-center justify-center"><MoreVertical className="w-5 h-5" /></button>
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
          <Link
            key={c.id}
            to="/courses/$id"
            params={{ id: c.id }}
            className="block group"
          >
            <div className="relative">
              {/* folder tab */}
              <div className={`h-4 w-2/3 rounded-t-xl ${colorMap[c.color]} border border-b-0 border-foreground/10`} />
              <div className={`rounded-2xl rounded-tl-none ${colorMap[c.color]} aspect-square border border-foreground/10 shadow-sm flex items-end p-3`}>
                <span className="text-[11px] uppercase tracking-wider font-semibold bg-card/70 backdrop-blur px-2 py-1 rounded-md">
                  {c.name}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* FAB */}
      <button
        onClick={() => setAdding(true)}
        className="fixed bottom-24 right-[calc(50%-200px)] sm:right-6 w-14 h-14 rounded-full bg-foreground text-primary-foreground flex items-center justify-center shadow-lg z-30"
      >
        <Plus className="w-6 h-6" />
      </button>

      {adding && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-end justify-center" onClick={() => setAdding(false)}>
          <div className="w-full max-w-[440px] bg-card rounded-t-3xl p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-2xl italic mb-4">New Course</h2>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Course name"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-sm"
            />
            <div className="mt-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Color</div>
              <div className="flex gap-2">
                {colorChoices.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-9 h-9 rounded-full ${colorMap[c]} border-2 ${color === c ? "border-foreground" : "border-transparent"}`}
                  />
                ))}
              </div>
            </div>
            <button
              disabled={!name.trim()}
              onClick={() => {
                setCourses((prev) => [...prev, { id: uid(), name: name.trim(), color }]);
                setName("");
                setAdding(false);
              }}
              className="mt-6 w-full py-3 rounded-xl bg-pastel-yellow font-semibold text-sm disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
