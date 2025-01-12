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
		client: {"start":"_app/immutable/entry/start.Dg5pYX9l.js","app":"_app/immutable/entry/app.Bm_1y_wk.js","imports":["_app/immutable/entry/start.Dg5pYX9l.js","_app/immutable/chunks/entry.C-GEGAjY.js","_app/immutable/chunks/index-client.CvPjOW-w.js","_app/immutable/chunks/index.CU3wpBA0.js","_app/immutable/entry/app.Bm_1y_wk.js","_app/immutable/chunks/index-client.CvPjOW-w.js","_app/immutable/chunks/disclose-version.CkmQrO1S.js","_app/immutable/chunks/props.HYy-qROY.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js'))
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
				id: "/api/admin/[id]",
				pattern: /^\/api\/admin\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/_id_/_server.ts.js'))
			},
			{
				id: "/api/locker",
				pattern: /^\/api\/locker\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/locker/_server.ts.js'))
			},
			{
				id: "/api/register",
				pattern: /^\/api\/register\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/register/_server.ts.js'))
			},
			{
				id: "/api/[otp]",
				pattern: /^\/api\/([^/]+?)\/?$/,
				params: [{"name":"otp","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_otp_/_server.ts.js'))
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
