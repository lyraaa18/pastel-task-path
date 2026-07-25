import { l as lazyRouteComponent, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/todo._id-40m8iPRf.js
var $$splitComponentImporter = () => import("./todo._id-BHSG0D3Y.mjs");
var Route = createFileRoute("/todo/$id")({
	head: ({ params }) => ({ meta: [{ title: `Task — Student OS` }, {
		name: "description",
		content: `Task ${params.id}`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
