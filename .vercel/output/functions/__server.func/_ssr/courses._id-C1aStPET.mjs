import { l as lazyRouteComponent, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/courses._id-C1aStPET.js
var $$splitComponentImporter = () => import("./courses._id-Xhw3TpoR.mjs");
var Route = createFileRoute("/courses/$id")({
	head: ({ params }) => ({ meta: [{ title: `Course — Student OS` }, {
		name: "description",
		content: `Course ${params.id}`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
