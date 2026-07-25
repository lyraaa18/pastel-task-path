import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useCourses, useTodos, DAY_LABELS, uid, type Course } from "@/lib/store";
import { ChevronLeft, Image as ImgIcon, ChevronDown, Trash2, Plus, FileText, ExternalLink, BookOpen, X, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { CourseForm } from "@/components/CourseForm";

export const Route = createFileRoute("/courses/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Course — Student OS` }, { name: "description", content: `Course ${params.id}` }],
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

const tabs = ["To-do", "Files", "Study Sets", "Links"] as const;

function CourseDetail() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const [courses, setCourses, isCoursesLoading] = useCourses();
  const [todos, setTodos, isTodosLoading] = useTodos();
  const [tab, setTab] = useState<(typeof tabs)[number]>("To-do");
  const [filter, setFilter] = useState<"Ongoing" | "Done">("Ongoing");
  const [editing, setEditing] = useState(false);

  // States for Mock Tabs
  const [newFileName, setNewFileName] = useState("");
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newSetTitle, setNewSetTitle] = useState("");
  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  
  // Flashcard Flipper state
  const [activeStudySetId, setActiveStudySetId] = useState<string | null>(null);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const isLoading = isCoursesLoading || isTodosLoading;

  if (isLoading) {
    return <MobileShell isLoading={true}><div>Loading...</div></MobileShell>;
  }

  const course = courses.find((c) => c.id === id);
  if (!course) {
    return (
      <MobileShell>
        <div className="p-10 text-center text-muted-foreground">
          Course not found.
          <button onClick={() => nav({ to: "/courses" })} className="block mx-auto mt-4 text-sm underline">Back to courses</button>
        </div>
      </MobileShell>
    );
  }

  const courseTodos = todos.filter((t) => t.courseId === id && (filter === "Ongoing" ? !t.done : t.done));

  const schedText = course.schedules?.length
    ? course.schedules
        .map((s) => `${s.days.map((d) => DAY_LABELS[d].toUpperCase().slice(0, 3)).join("/")} | ${s.start} - ${s.end}`)
        .join(" • ")
    : course.day && course.time
    ? `${course.day} | ${course.time}`
    : "—";

  const updateCourse = (updated: Course) => {
    setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const addFile = (fileName: string) => {
    if (!fileName.trim()) return;
    const sizes = ["1.2 MB", "4.5 MB", "850 KB", "2.1 MB", "12.4 MB", "3.2 MB"];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    const newFile = {
      id: uid(),
      name: fileName.trim(),
      size: randomSize,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    const updated = {
      ...course,
      files: [...(course.files || []), newFile],
    };
    updateCourse(updated);
    setNewFileName("");
  };

  const deleteFile = (fid: string) => {
    const updated = {
      ...course,
      files: (course.files || []).filter((f) => f.id !== fid),
    };
    updateCourse(updated);
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

  const addStudySet = (title: string) => {
    if (!title.trim()) return;
    const newSet = { id: uid(), title: title.trim(), cards: [] };
    const updated = {
      ...course,
      studySets: [...(course.studySets || []), newSet],
    };
    updateCourse(updated);
    setNewSetTitle("");
  };

  const deleteStudySet = (sid: string) => {
    const updated = {
      ...course,
      studySets: (course.studySets || []).filter((s) => s.id !== sid),
    };
    updateCourse(updated);
  };

  const addFlashcard = (sid: string, q: string, a: string) => {
    if (!q.trim() || !a.trim()) return;
    const newCard = { id: uid(), question: q.trim(), answer: a.trim() };
    const updated = {
      ...course,
      studySets: (course.studySets || []).map((s) =>
        s.id === sid ? { ...s, cards: [...s.cards, newCard] } : s
      ),
    };
    updateCourse(updated);
    setNewQ("");
    setNewA("");
  };

  const deleteFlashcard = (sid: string, cid: string) => {
    const updated = {
      ...course,
      studySets: (course.studySets || []).map((s) =>
        s.id === sid ? { ...s, cards: s.cards.filter((c) => c.id !== cid) } : s
      ),
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
                (tab === t ? "bg-pastel-yellow font-semibold" : "bg-secondary text-muted-foreground")
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
                      <div className="w-9 h-9 rounded-lg bg-pastel-yellow/60 flex items-center justify-center">📝</div>
                      <div className="flex-1 min-w-0">
                        <div className={"text-sm font-medium truncate " + (t.done ? "line-through text-muted-foreground" : "")}>{t.title}</div>
                        {t.deadline && (
                          <div className="text-[11px] text-pastel-orange mt-0.5">
                            {new Date(t.deadline).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault(); e.stopPropagation();
                          setTodos((prev) => prev.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)));
                        }}
                        className={"w-6 h-6 rounded-md border-2 flex items-center justify-center " + (t.done ? "bg-foreground border-foreground" : "border-border")}
                      >
                        {t.done && <span className="text-primary-foreground text-xs">✓</span>}
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault(); e.stopPropagation();
                          if (confirm(`Delete "${t.title}"?`)) setTodos((prev) => prev.filter((x) => x.id !== t.id));
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
        ) : tab === "Files" ? (
          <div className="mt-4 pb-12">
            <div className="flex gap-2">
              <input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="Simulate uploading file (e.g. Syllabus.pdf)"
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background outline-none text-sm"
              />
              <button 
                onClick={() => addFile(newFileName)}
                className="px-4 rounded-xl bg-pastel-yellow font-semibold text-xs flex items-center gap-1 active:scale-95 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Upload
              </button>
            </div>
            <div className="mt-6 space-y-3">
              {(!course.files || course.files.length === 0) ? (
                <div className="text-center py-10 text-muted-foreground text-sm border border-dashed border-border rounded-2xl bg-card/30">
                  <div className="text-4xl mb-3">📁</div>
                  No files added yet.
                </div>
              ) : (
                course.files.map((file) => (
                  <div key={file.id} className="rounded-2xl bg-card border border-border p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pastel-blue/60 flex items-center justify-center text-lg">
                      <FileText className="w-5 h-5 text-blue-800" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{file.size} · {file.date}</div>
                    </div>
                    <button 
                      onClick={() => deleteFile(file.id)}
                      className="text-muted-foreground hover:text-destructive p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : tab === "Links" ? (
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
              {(!course.links || course.links.length === 0) ? (
                <div className="text-center py-10 text-muted-foreground text-sm border border-dashed border-border rounded-2xl bg-card/30">
                  <div className="text-4xl mb-3">🔗</div>
                  No links saved yet.
                </div>
              ) : (
                course.links.map((link) => (
                  <div key={link.id} className="rounded-2xl bg-card border border-border p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pastel-green/60 flex items-center justify-center text-lg">
                      <ExternalLink className="w-5 h-5 text-green-800" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{link.title}</div>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-pastel-blue hover:underline block truncate mt-0.5 flex items-center gap-1">
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
        ) : tab === "Study Sets" ? (
          <div className="mt-4 pb-12">
            {editingSetId ? (
              (() => {
                const activeSet = (course.studySets || []).find((s) => s.id === editingSetId);
                if (!activeSet) return null;
                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <h3 className="font-serif text-lg italic truncate">{activeSet.title}</h3>
                      <button 
                        onClick={() => setEditingSetId(null)}
                        className="text-xs bg-secondary px-3 py-1.5 rounded-full font-semibold"
                      >
                        Back
                      </button>
                    </div>

                    <div className="bg-card/40 border border-border p-4 rounded-2xl space-y-3">
                      <div className="text-xs font-semibold uppercase text-muted-foreground">Add New Card</div>
                      <input
                        value={newQ}
                        onChange={(e) => setNewQ(e.target.value)}
                        placeholder="Question (Front)"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background outline-none text-sm"
                      />
                      <div className="flex gap-2">
                        <input
                          value={newA}
                          onChange={(e) => setNewA(e.target.value)}
                          placeholder="Answer (Back)"
                          className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background outline-none text-sm"
                        />
                        <button 
                          onClick={() => addFlashcard(editingSetId, newQ, newA)}
                          className="px-4 rounded-xl bg-pastel-yellow font-semibold text-xs flex items-center gap-1 active:scale-95 transition"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 mt-4">
                      {activeSet.cards.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground text-sm">No cards yet. Create some above!</div>
                      ) : (
                        activeSet.cards.map((card) => (
                          <div key={card.id} className="rounded-xl border border-border bg-card p-3 flex justify-between items-start gap-4">
                            <div className="text-sm flex-1">
                              <div className="font-semibold">Q: {card.question}</div>
                              <div className="text-muted-foreground mt-1">A: {card.answer}</div>
                            </div>
                            <button 
                              onClick={() => deleteFlashcard(editingSetId, card.id)}
                              className="text-muted-foreground hover:text-destructive p-1 shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })()
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    value={newSetTitle}
                    onChange={(e) => setNewSetTitle(e.target.value)}
                    placeholder="New study set title (e.g. Midterm prep)"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background outline-none text-sm"
                  />
                  <button 
                    onClick={() => addStudySet(newSetTitle)}
                    className="px-4 rounded-xl bg-pastel-yellow font-semibold text-xs flex items-center gap-1 active:scale-95 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create
                  </button>
                </div>
                <div className="mt-6 space-y-3">
                  {(!course.studySets || course.studySets.length === 0) ? (
                    <div className="text-center py-10 text-muted-foreground text-sm border border-dashed border-border rounded-2xl bg-card/30">
                      <div className="text-4xl mb-3">💡</div>
                      No study sets yet.
                    </div>
                  ) : (
                    course.studySets.map((set) => (
                      <div key={set.id} className="rounded-2xl bg-card border border-border p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-pastel-yellow/60 flex items-center justify-center text-lg">💡</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">{set.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{set.cards.length} cards</div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button 
                            onClick={() => {
                              if (set.cards.length > 0) {
                                setActiveStudySetId(set.id);
                                setCurrentCardIdx(0);
                                setIsFlipped(false);
                              } else {
                                alert("Add some cards first!");
                              }
                            }}
                            disabled={set.cards.length === 0}
                            className="w-8 h-8 rounded-full bg-pastel-yellow flex items-center justify-center text-foreground font-semibold active:scale-95 transition disabled:opacity-40"
                            title="Study Set"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => setEditingSetId(set.id)}
                            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-95 transition"
                            title="Edit Cards"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteStudySet(set.id)}
                            className="w-8 h-8 rounded-full bg-destructive/15 text-destructive flex items-center justify-center active:scale-95 transition"
                            title="Delete Set"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 text-center text-sm text-muted-foreground">Coming soon.</div>
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

      {/* Flashcard Study/Flipper Modal Overlay */}
      {activeStudySetId && (() => {
        const activeSet = (course.studySets || []).find((s) => s.id === activeStudySetId);
        if (!activeSet || activeSet.cards.length === 0) return null;
        const currentCard = activeSet.cards[currentCardIdx];
        return (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4" onClick={() => setActiveStudySetId(null)}>
            <div className="w-full max-w-[400px] bg-card border border-border rounded-3xl p-6 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setActiveStudySetId(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="font-serif text-lg italic mb-1 text-center pr-6 truncate">{activeSet.title}</h2>
              <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest mb-6">
                Card {currentCardIdx + 1} of {activeSet.cards.length}
              </p>

              {/* Flashcard Flipper Box */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className="aspect-[4/3] rounded-2xl bg-pastel-yellow/30 border-2 border-dashed border-pastel-yellow flex flex-col items-center justify-center text-center p-6 cursor-pointer select-none transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden"
              >
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground absolute top-4">
                  {isFlipped ? "Answer" : "Question"}
                </div>

                <div className="text-lg font-medium px-4 break-words max-h-full overflow-y-auto">
                  {isFlipped ? currentCard.answer : currentCard.question}
                </div>

                <div className="text-[9px] text-muted-foreground absolute bottom-4">
                  Click card to flip
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-between items-center mt-6">
                <button 
                  disabled={currentCardIdx === 0}
                  onClick={() => { setCurrentCardIdx((prev) => prev - 1); setIsFlipped(false); }}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-secondary rounded-full disabled:opacity-40"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <button 
                  disabled={currentCardIdx === activeSet.cards.length - 1}
                  onClick={() => { setCurrentCardIdx((prev) => prev + 1); setIsFlipped(false); }}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-secondary rounded-full disabled:opacity-40"
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })()}
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
