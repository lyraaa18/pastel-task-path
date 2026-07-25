//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-D764ZhV5.js
var manifest = {
	"048541e9910caa4f1ecf2c5917c1beb1f53221dc270e382994e93ea973da9da5": {
		functionName: "getCoursesFn_createServerFn_handler",
		importer: () => import("./_ssr/dbServer-DHXFLB0B.mjs")
	},
	"04c8fb39ce8cd1bac608f72bb048fe51b20e4d45d17d65eb0d33e58d78c38f83": {
		functionName: "deleteHabitFn_createServerFn_handler",
		importer: () => import("./_ssr/dbServer-DHXFLB0B.mjs")
	},
	"0ccebc738b43d541be6b638c66d210db6c790260995b4ba2c794a83249f872d1": {
		functionName: "getProfileFn_createServerFn_handler",
		importer: () => import("./_ssr/dbServer-DHXFLB0B.mjs")
	},
	"0de0d7df5130f25542a48510744f779f573045a5b25b313e741f28410748b155": {
		functionName: "saveCourseFn_createServerFn_handler",
		importer: () => import("./_ssr/dbServer-DHXFLB0B.mjs")
	},
	"2675f3fa48d16aaf637628d2bfdcc95947befe4683edaf6e9cf3c9d06dd402f5": {
		functionName: "saveHabitFn_createServerFn_handler",
		importer: () => import("./_ssr/dbServer-DHXFLB0B.mjs")
	},
	"2ebe43bb67dd39173f48a28f03137ea783f7b2f12d4c7ff8414037a7c0e4e5df": {
		functionName: "deleteTodoFn_createServerFn_handler",
		importer: () => import("./_ssr/dbServer-DHXFLB0B.mjs")
	},
	"31106b17cb2344efb31199a3728f9988ff394653ceff344ddb422fc9e4ab72dd": {
		functionName: "resetDbFn_createServerFn_handler",
		importer: () => import("./_ssr/dbServer-DHXFLB0B.mjs")
	},
	"6103ee6140587c709da7416f450babc9207f7abeea0699c990d4781f3be83bb7": {
		functionName: "getTodosFn_createServerFn_handler",
		importer: () => import("./_ssr/dbServer-DHXFLB0B.mjs")
	},
	"a72cb693c1304fa60245833860aef27b04a41a851bcaeb025686cec6944d31c5": {
		functionName: "updateProfileFn_createServerFn_handler",
		importer: () => import("./_ssr/dbServer-DHXFLB0B.mjs")
	},
	"d6213460df8a49fadf6ac51b5d2e4d02fe89274c1f9c8ad7cce5eb34f923343e": {
		functionName: "deleteCourseFn_createServerFn_handler",
		importer: () => import("./_ssr/dbServer-DHXFLB0B.mjs")
	},
	"d66e575b718c940fa5dbfbccc7fc7464be405fd31e6d1360f94c9e55dc7f7c00": {
		functionName: "saveTodoFn_createServerFn_handler",
		importer: () => import("./_ssr/dbServer-DHXFLB0B.mjs")
	},
	"ebcf708171b20f8f0252eed5a6293a329055c5ee9b6484c634200deb23dfa1ae": {
		functionName: "getHabitsFn_createServerFn_handler",
		importer: () => import("./_ssr/dbServer-DHXFLB0B.mjs")
	},
	"ee85124d4e1daab50938ada6296c8513e4fecd1b9e5e4753afa2f6e40c342a2f": {
		functionName: "initializeDbFn_createServerFn_handler",
		importer: () => import("./_ssr/dbServer-DHXFLB0B.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
