import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as resetDbFn, l as useProfile, n as MobileShell, r as resetAllStores } from "./store-C7mJTtB7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-DHxRmK9g.js
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const [profile, setProfile] = useProfile();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MobileShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "px-6 pt-10 pb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-3xl italic",
			children: "Settings"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground mt-1",
			children: "Personalize your Student ID."
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "px-6 mt-4 space-y-4",
		children: [[
			"name",
			"school",
			"birthday",
			"yearLevel"
		].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "text-xs uppercase tracking-wider text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: profile[k],
			onChange: (e) => setProfile({
				...profile,
				[k]: e.target.value
			}),
			className: "mt-1 w-full px-4 py-3 rounded-xl border border-border bg-card outline-none text-sm"
		})] }, k)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: async () => {
				if (confirm("Reset all app data (including Neon Database)?")) {
					const secret = prompt("Please enter the Reset DB Secret to confirm (leave blank if none is configured):") ?? "";
					try {
						const res = await resetDbFn({ data: { secret } });
						if (res && res.success) {
							localStorage.clear();
							resetAllStores();
							location.reload();
						} else alert("Failed to reset database.");
					} catch (err) {
						console.error(err);
						alert("Failed to reset database. Make sure your secret is correct.");
					}
				}
			},
			className: "mt-6 w-full py-3 rounded-xl border border-destructive/40 text-destructive text-sm font-semibold",
			children: "Reset all data"
		})]
	})] });
}
//#endregion
export { SettingsPage as component };
