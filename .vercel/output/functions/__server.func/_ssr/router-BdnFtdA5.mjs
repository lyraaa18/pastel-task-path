import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as Outlet, d as createRootRouteWithContext, f as Link, i as HeadContent, l as lazyRouteComponent, m as useRouter, r as Scripts, s as createRouter, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$7 } from "./courses._id-C1aStPET.mjs";
import { t as Route$8 } from "./todo._id-40m8iPRf.mjs";
import { t as Route$9 } from "./todo.new-CV_3Bzv1.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BdnFtdA5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-C4u4zwUK.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$6 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, maximum-scale=1"
			},
			{
				name: "theme-color",
				content: "#fcfbf8"
			},
			{ title: "Student OS — Planner & Habits" },
			{
				name: "description",
				content: "A calm student productivity app: courses, to-dos, schedule and habits."
			},
			{
				property: "og:title",
				content: "Student OS — Planner & Habits"
			},
			{
				property: "og:description",
				content: "A calm student productivity app: courses, to-dos, schedule and habits."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/manifest.json"
			},
			{
				rel: "apple-touch-icon",
				href: "/icon-192.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$6.useRouteContext();
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined" && "serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").then(() => console.log("Service Worker registered successfully")).catch((err) => console.error("Service worker registration failed:", err));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$5 = () => import("./routes-9hWArOlq.mjs");
var Route$5 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Home — Student OS" }, {
		name: "description",
		content: "Your daily greeting, student ID, and ongoing tasks."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./calendar-DldD4GM2.mjs");
var Route$4 = createFileRoute("/calendar")({
	head: () => ({ meta: [{ title: "Calendar — Student OS" }, {
		name: "description",
		content: "Month view of your tasks."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./courses-DiwBtvS5.mjs");
var Route$3 = createFileRoute("/courses")({
	head: () => ({ meta: [{ title: "Courses — Student OS" }, {
		name: "description",
		content: "Folder-style course library."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./habits-DcnwfEJk.mjs");
var Route$2 = createFileRoute("/habits")({
	head: () => ({ meta: [{ title: "Habits — Student OS" }, {
		name: "description",
		content: "Track daily habits and weekly progress."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./schedule-CDF0W9QD.mjs");
var Route$1 = createFileRoute("/schedule")({
	head: () => ({ meta: [{ title: "Class Schedule — Student OS" }, {
		name: "description",
		content: "Your weekly class schedule."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./settings-DHxRmK9g.mjs");
var Route = createFileRoute("/settings")({
	head: () => ({ meta: [{ title: "Settings — Student OS" }, {
		name: "description",
		content: "Edit your profile."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$6
});
var CalendarRoute = Route$4.update({
	id: "/calendar",
	path: "/calendar",
	getParentRoute: () => Route$6
});
var CoursesRoute = Route$3.update({
	id: "/courses",
	path: "/courses",
	getParentRoute: () => Route$6
});
var HabitsRoute = Route$2.update({
	id: "/habits",
	path: "/habits",
	getParentRoute: () => Route$6
});
var ScheduleRoute = Route$1.update({
	id: "/schedule",
	path: "/schedule",
	getParentRoute: () => Route$6
});
var SettingsRoute = Route.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$6
});
var CoursesIdRoute = Route$7.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => CoursesRoute
});
var TodoIdRoute = Route$8.update({
	id: "/todo/$id",
	path: "/todo/$id",
	getParentRoute: () => Route$6
});
var TodoNewRoute = Route$9.update({
	id: "/todo/new",
	path: "/todo/new",
	getParentRoute: () => Route$6
});
var CoursesRouteChildren = { CoursesIdRoute };
var rootRouteChildren = {
	IndexRoute,
	CalendarRoute,
	CoursesRoute: CoursesRoute._addFileChildren(CoursesRouteChildren),
	HabitsRoute,
	ScheduleRoute,
	SettingsRoute,
	TodoIdRoute,
	TodoNewRoute
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
