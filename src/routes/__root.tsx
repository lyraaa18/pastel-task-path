import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { ClerkProvider, SignIn, useAuth } from "@clerk/tanstack-react-start";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
      { name: "theme-color", content: "#fcfbf8" },
      { title: "SYNAPSE — Planner & Habits" },
      {
        name: "description",
        content: "A calm student productivity app: courses, to-dos, schedule and habits.",
      },
      { property: "og:title", content: "SYNAPSE — Planner & Habits" },
      {
        property: "og:description",
        content: "A calm student productivity app: courses, to-dos, schedule and habits.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AppContent({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcfbf8] font-sans">
        <div className="text-[#2C2925] text-sm tracking-widest uppercase animate-pulse">
          Loading SYNAPSE...
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfbf8] p-6 text-foreground font-sans">
        <div className="w-full max-w-[460px] bg-white border border-[#E9E4DB] rounded-3xl p-8 shadow-sm flex flex-col items-center">
          <div className="mb-6 text-center">
            <h1 className="font-serif text-4xl text-[#2C2925] tracking-tight mb-2">SYNAPSE</h1>
            <p className="text-neutral-500 text-sm max-w-[320px] mx-auto leading-relaxed">
              A calm space to organize your courses, tasks, schedule, and habits.
            </p>
          </div>
          <SignIn routing="hash" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js")
        .then(() => console.log("Service Worker registered successfully"))
        .catch((err) => console.error("Service worker registration failed:", err));
    }
  }, []);

  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfbf8] p-6 text-foreground font-sans text-center">
        <div className="w-full max-w-[460px] bg-white border border-[#E9E4DB] rounded-3xl p-8 shadow-sm flex flex-col items-center">
          <h1 className="font-serif text-3xl text-[#2C2925] tracking-tight mb-4">Configuration Required</h1>
          <p className="text-neutral-600 text-sm mb-6 leading-relaxed max-w-[320px]">
            Authentication environment variables are missing. Please configure your Clerk keys.
          </p>
          <div className="bg-neutral-50 p-4 rounded-xl text-left text-xs font-mono text-neutral-600 space-y-3 border border-neutral-100 w-full mb-6">
            <div>
              <span className="font-semibold text-neutral-800">1. Local Dev (.env):</span>
              <div className="bg-white p-2 rounded border border-neutral-200 select-all mt-1 font-mono text-[10px]">
                VITE_CLERK_PUBLISHABLE_KEY=your_key_here
              </div>
            </div>
            <div>
              <span className="font-semibold text-neutral-800">2. Production (Vercel Settings):</span>
              <p className="mt-1 text-neutral-500">Add these Environment Variables:</p>
              <ul className="list-disc list-inside mt-1 font-sans text-[11px] space-y-0.5 text-neutral-700">
                <li><code className="font-mono text-[10px] bg-neutral-200/50 px-1 py-0.5 rounded">VITE_CLERK_PUBLISHABLE_KEY</code></li>
                <li><code className="font-mono text-[10px] bg-neutral-200/50 px-1 py-0.5 rounded">CLERK_SECRET_KEY</code></li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-neutral-400">Remember to redeploy your project on Vercel after adding the keys.</p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <AppContent>
        <QueryClientProvider client={queryClient}>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </QueryClientProvider>
      </AppContent>
    </ClerkProvider>
  );
}
