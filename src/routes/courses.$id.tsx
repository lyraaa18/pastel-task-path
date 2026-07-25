import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useCourses, useTodos, DAY_LABELS, uid, type Course } from "@/lib/store";
import {
  ChevronLeft,
  ChevronDown,
  Trash2,
  Plus,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { CourseForm } from "@/components/CourseForm";

export const Route = createFileRoute("/courses/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Course — Student OS` },
      { name: "description", content: `Course ${params.id}` },
    ],
  }),
  component: CourseDetail,
});

const gradients: Record<Course["color"], string> = {
  orange: "from-pastel-orange via-pastel-yellow to-background",
  blue: "from-pastel-blue via-pastel-gray to-background",
  gray: "from-pastel-gray via-pastel-blue/40 to-background",
  yellow: "from-pastel-yellow via-pastel-orange/40 to-background",
  pink: "from-pastel-pink via-pastel-orange/30 to-background",
  green: "from-pastel-green via-pastel-yellow/30 to-background",
};

const tabs = ["To-do", "Links"] as const;

function CourseDetail() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const [courses, setCourses, isCoursesLoading] = useCourses();
  const [todos, setTodos, isTodosLoading] = useTodos();
  const [tab, setTab] = useState<(typeof tabs)[number]>("To-do");
  const [filter, setFilter] = useState<"Ongoing" | "Done">("Ongoing");
  const [editing, setEditing] = useState(false);

  // States for Mock Tabs
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const isLoading = isCoursesLoading || isTodosLoading;

  if (isLoading) {
    return (
      <MobileShell isLoading={true}>
        <div>Loading...</div>
      </MobileShell>
    );
  }

  const course = courses.find((c) => c.id === id);
  if (!course) {
    return (
      <MobileShell>
        <div className="p-10 text-center text-muted-foreground">
          Course not found.
          <button
            onClick={() => nav({ to: "/courses" })}
            className="block mx-auto mt-4 text-sm underline"
          >
            Back to courses
          </button>
        </div>
      </MobileShell>
    );
  }

  const courseTodos = todos.filter(
    (t) => t.courseId === id && (filter === "Ongoing" ? !t.done : t.done),
  );

  const schedText = course.schedules?.length
    ? course.schedules
        .map(
          (s) =>
            `${s.days.map((d) => DAY_LABELS[d].toUpperCase().slice(0, 3)).join("/")} | ${s.start} - ${s.end}`,
        )
        .join(" • ")
    : "—";

  const updateCourse = (updated: Course) => {
    setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const addLink = (title: string, url: string) => {
    if (!title.trim() || !url.trim()) return;
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }
    const newLink = { id: uid(), title: title.trim(), url: formattedUrl };
    const updated = {
      ...course,
      links: [...(course.links || []), newLink],
    };
    updateCourse(updated);
    setNewLinkTitle("");
    setNewLinkUrl("");
  };

  const deleteLink = (lid: string) => {
    const updated = {
      ...course,
      links: (course.links || []).filter((l) => l.id !== lid),
    };
    updateCourse(updated);
  };

  return (
    <MobileShell>
      <div className={`relative h-64 bg-gradient-to-b ${gradients[course.color]}`}>
        <button
          onClick={() => nav({ to: "/courses" })}
          className="absolute top-10 left-5 w-10 h-10 rounded-full bg-foreground/15 backdrop-blur flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setEditing(true)}
          className="absolute bottom-6 right-5 text-xs px-3 py-1.5 rounded-full bg-card border border-border"
        >
          Edit Course
        </button>
      </div>

      <div className="px-6 pt-6">
        <h1 className="font-serif text-3xl italic lowercase">{course.name}</h1>
        <div className="mt-4 space-y-2 text-sm">
          <Row label="👤 Instructor" value={course.instructor ?? "—"} />
          <Row label="🕐 Schedules" value={schedText} />
          <Row label="📍 Room Location" value={course.room ?? "—"} />
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setEditingSetId(null);
              }}
              className={
                "px-4 py-1.5 rounded-full text-xs whitespace-nowrap " +
                (tab === t
                  ? "bg-pastel-yellow font-semibold"
                  : "bg-secondary text-muted-foreground")
              }
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "To-do" ? (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setFilter(filter === "Ongoing" ? "Done" : "Ongoing")}
                className="flex items-center gap-1 text-xs bg-secondary px-3 py-1.5 rounded-full"
              >
                {filter} <ChevronDown className="w-3 h-3" />
              </button>
              <Link
                to="/todo/new"
                search={{ courseId: id }}
                className="text-xs px-3 py-1.5 rounded-full bg-pastel-yellow font-semibold"
              >
                + To-do
              </Link>
            </div>
            <div className="mt-6 space-y-3 pb-10">
              {courseTodos.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  <div className="text-4xl mb-3">📋</div>
                  No tasks to accomplish.
                  <div className="mt-4">
                    <Link
                      to="/todo/new"
                      search={{ courseId: id }}
                      className="inline-block text-xs px-4 py-2 rounded-full bg-pastel-yellow font-semibold"
                    >
                      + To-do
                    </Link>
                  </div>
                </div>
              ) : (
                courseTodos.map((t) => (
                  <div key={t.id} className="relative">
                    <Link
                      to="/todo/$id"
                      params={{ id: t.id }}
                      className="rounded-2xl bg-card border border-border p-4 flex items-center gap-3 active:scale-[0.99] transition"
                    >
                      <div className="w-9 h-9 rounded-lg bg-pastel-yellow/60 flex items-center justify-center">
                        📝
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={
                            "text-sm font-medium truncate " +
                            (t.done ? "line-through text-muted-foreground" : "")
                          }
                        >
                          {t.title}
                        </div>
                        {t.deadline && (
                          <div className="text-[11px] text-pastel-orange mt-0.5">
                            {new Date(t.deadline).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setTodos((prev) =>
                            prev.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)),
                          );
                        }}
                        className={
                          "w-6 h-6 rounded-md border-2 flex items-center justify-center " +
                          (t.done ? "bg-foreground border-foreground" : "border-border")
                        }
                      >
                        {t.done && <span className="text-primary-foreground text-xs">✓</span>}
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (confirm(`Delete "${t.title}"?`))
                            setTodos((prev) => prev.filter((x) => x.id !== t.id));
                        }}
                        className="text-muted-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 pb-12">
            <div className="space-y-3 bg-card/40 border border-border p-4 rounded-2xl">
              <input
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                placeholder="Link Title (e.g., Course Portal)"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background outline-none text-sm"
              />
              <div className="flex gap-2">
                <input
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="URL (e.g., portal.school.edu)"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background outline-none text-sm"
                />
                <button
                  onClick={() => addLink(newLinkTitle, newLinkUrl)}
                  className="px-4 rounded-xl bg-pastel-yellow font-semibold text-xs flex items-center gap-1 active:scale-95 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Link
                </button>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {!course.links || course.links.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm border border-dashed border-border rounded-2xl bg-card/30">
                  <div className="text-4xl mb-3">🔗</div>
                  No links saved yet.
                </div>
              ) : (
                course.links.map((link) => (
                  <div
                    key={link.id}
                    className="rounded-2xl bg-card border border-border p-4 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-pastel-green/60 flex items-center justify-center text-lg">
                      <ExternalLink className="w-5 h-5 text-green-800" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{link.title}</div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-pastel-blue hover:underline block truncate mt-0.5 flex items-center gap-1"
                      >
                        {link.url}
                      </a>
                    </div>
                    <button
                      onClick={() => deleteLink(link.id)}
                      className="text-muted-foreground hover:text-destructive p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {editing && (
        <CourseForm
          initial={course}
          onClose={() => setEditing(false)}
          onSave={(updated) => {
            setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
            setEditing(false);
          }}
          onDelete={() => {
            if (confirm(`Delete "${course.name}"?`)) {
              setCourses((prev) => prev.filter((c) => c.id !== course.id));
              nav({ to: "/courses" });
            }
          }}
        />
      )}
    </MobileShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-foreground/80">{label}</span>
      <span className="flex-1 border-b border-dashed border-border" />
      <span className="text-foreground/80 text-right">{value}</span>
    </div>
  );
}
