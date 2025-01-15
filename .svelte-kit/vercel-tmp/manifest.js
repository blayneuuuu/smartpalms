export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.B2sPMF7s.js","app":"_app/immutable/entry/app.CZJ5k1S2.js","imports":["_app/immutable/entry/start.B2sPMF7s.js","_app/immutable/chunks/entry.BzdZ0skD.js","_app/immutable/chunks/index-client.A1mlkm1m.js","_app/immutable/chunks/index.C0GZNb9n.js","_app/immutable/entry/app.CZJ5k1S2.js","_app/immutable/chunks/index-client.A1mlkm1m.js","_app/immutable/chunks/disclose-version.DAuCITe-.js","_app/immutable/chunks/props.BzQReNhN.js","_app/immutable/chunks/svelte-component.Ua6OYMEt.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js')),
			__memo(() => import('../output/server/nodes/4.js')),
			__memo(() => import('../output/server/nodes/5.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/admin/requests",
				pattern: /^\/api\/admin\/requests\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/admin/requests/_server.ts.js'))
			},
			{
				id: "/api/admin/requests/[id]",
				pattern: /^\/api\/admin\/requests\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/admin/requests/_id_/_server.ts.js'))
			},
			{
				id: "/api/admin/stats",
				pattern: /^\/api\/admin\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/admin/stats/_server.ts.js'))
			},
			{
				id: "/api/admin/[id]",
				pattern: /^\/api\/admin\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/admin/_id_/_server.ts.js'))
			},
			{
				id: "/api/lockers",
				pattern: /^\/api\/lockers\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/lockers/_server.ts.js'))
			},
			{
				id: "/api/lockers/request",
				pattern: /^\/api\/lockers\/request\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/lockers/request/_server.ts.js'))
			},
			{
				id: "/api/lockers/[id]",
				pattern: /^\/api\/lockers\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/lockers/_id_/_server.ts.js'))
			},
			{
				id: "/api/locker",
				pattern: /^\/api\/locker\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/locker/_server.ts.js'))
			},
			{
				id: "/api/register",
				pattern: /^\/api\/register\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/register/_server.ts.js'))
			},
			{
				id: "/api/subscription-types",
				pattern: /^\/api\/subscription-types\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/subscription-types/_server.ts.js'))
			},
			{
				id: "/api/test",
				pattern: /^\/api\/test\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/test/_server.js'))
			},
			{
				id: "/api/transaction",
				pattern: /^\/api\/transaction\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/transaction/_server.ts.js'))
			},
			{
				id: "/api/[otp]",
				pattern: /^\/api\/([^/]+?)\/?$/,
				params: [{"name":"otp","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/_otp_/_server.ts.js'))
			},
			{
				id: "/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/lockers",
				pattern: /^\/lockers\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/register",
				pattern: /^\/register\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
