import { l as lazyRouteComponent, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as objectType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/todo.new-CV_3Bzv1.js
var $$splitComponentImporter = () => import("./todo.new-WiAsVeU2.mjs");
var Route = createFileRoute("/todo/new")({
	validateSearch: objectType({
		courseId: stringType().optional(),
		edit: stringType().optional()
	}),
	head: () => ({ meta: [{ title: "New To-do" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
