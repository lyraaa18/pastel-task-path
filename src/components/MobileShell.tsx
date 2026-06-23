import { Link, useRouterState } from "@tanstack/react-router";
import { Home, FolderClosed, CalendarDays, Clock, Activity, Settings } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/courses", label: "Courses", icon: FolderClosed },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/schedule", label: "Schedule", icon: Clock },
  { to: "/habits", label: "Habits", icon: Activity },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background flex justify-center">
      <div className="w-full max-w-[440px] min-h-screen bg-background relative pb-24">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}

function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-card/95 backdrop-blur border-t border-border z-40">
      <ul className="grid grid-cols-6 px-2 py-2">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? path === "/" : path.startsWith(to);
          return (
            <li key={to}>
              <Link
                to={to}
                className="flex flex-col items-center gap-0.5 py-1.5 text-[10px]"
              >
                <Icon
                  className={
                    "w-5 h-5 transition " +
                    (active ? "text-foreground" : "text-muted-foreground")
                  }
                  strokeWidth={active ? 2.2 : 1.6}
                  fill={active && (label === "Courses" || label === "Habits") ? "var(--pastel-yellow)" : "none"}
                />
                <span className={active ? "text-foreground font-medium" : "text-muted-foreground"}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
