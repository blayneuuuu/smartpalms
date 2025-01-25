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
		client: {"start":"_app/immutable/entry/start.Cv9_DmY5.js","app":"_app/immutable/entry/app.DzFPSMkl.js","imports":["_app/immutable/entry/start.Cv9_DmY5.js","_app/immutable/chunks/entry.DSAGDIFt.js","_app/immutable/chunks/runtime.D1Gg6DO2.js","_app/immutable/chunks/index-client.XLq-70Ev.js","_app/immutable/entry/app.DzFPSMkl.js","_app/immutable/chunks/runtime.D1Gg6DO2.js","_app/immutable/chunks/render.5P34H023.js","_app/immutable/chunks/disclose-version.T6rPbwlf.js","_app/immutable/chunks/props.CI-ns3SY.js","_app/immutable/chunks/index-client.XLq-70Ev.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js'))
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
				id: "/api/access/external",
				pattern: /^\/api\/access\/external\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/access/external/_server.ts.js'))
			},
			{
				id: "/api/admin/lockers",
				pattern: /^\/api\/admin\/lockers\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/lockers/_server.ts.js'))
			},
			{
				id: "/api/admin/requests",
				pattern: /^\/api\/admin\/requests\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/requests/_server.ts.js'))
			},
			{
				id: "/api/admin/requests/[id]",
				pattern: /^\/api\/admin\/requests\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/requests/_id_/_server.ts.js'))
			},
			{
				id: "/api/admin/stats",
				pattern: /^\/api\/admin\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/stats/_server.ts.js'))
			},
			{
				id: "/api/admin/subscription-types",
				pattern: /^\/api\/admin\/subscription-types\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/subscription-types/_server.ts.js'))
			},
			{
				id: "/api/admin/subscription-types/[id]",
				pattern: /^\/api\/admin\/subscription-types\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/subscription-types/_id_/_server.ts.js'))
			},
			{
				id: "/api/admin/users",
				pattern: /^\/api\/admin\/users\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/users/_server.ts.js'))
			},
			{
				id: "/api/admin/[id]",
				pattern: /^\/api\/admin\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/_id_/_server.ts.js'))
			},
			{
				id: "/api/auth/signout",
				pattern: /^\/api\/auth\/signout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/auth/signout/_server.ts.js'))
			},
			{
				id: "/api/lockers",
				pattern: /^\/api\/lockers\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/lockers/_server.ts.js'))
			},
			{
				id: "/api/lockers/external",
				pattern: /^\/api\/lockers\/external\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/lockers/external/_server.ts.js'))
			},
			{
				id: "/api/lockers/request",
				pattern: /^\/api\/lockers\/request\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/lockers/request/_server.ts.js'))
			},
			{
				id: "/api/lockers/request/[id]/resubmit",
				pattern: /^\/api\/lockers\/request\/([^/]+?)\/resubmit\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/lockers/request/_id_/resubmit/_server.ts.js'))
			},
			{
				id: "/api/lockers/user/[id]",
				pattern: /^\/api\/lockers\/user\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/lockers/user/_id_/_server.ts.js'))
			},
			{
				id: "/api/lockers/user/[id]/access-history",
				pattern: /^\/api\/lockers\/user\/([^/]+?)\/access-history\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/lockers/user/_id_/access-history/_server.ts.js'))
			},
			{
				id: "/api/lockers/[id]",
				pattern: /^\/api\/lockers\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/lockers/_id_/_server.ts.js'))
			},
			{
				id: "/api/lockers/[id]/otp",
				pattern: /^\/api\/lockers\/([^/]+?)\/otp\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/lockers/_id_/otp/_server.ts.js'))
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
				id: "/api/subscription-types",
				pattern: /^\/api\/subscription-types\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/subscription-types/_server.ts.js'))
			},
			{
				id: "/api/test",
				pattern: /^\/api\/test\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/test/_server.js'))
			},
			{
				id: "/api/transaction",
				pattern: /^\/api\/transaction\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/transaction/_server.ts.js'))
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
				id: "/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/logout/_server.ts.js'))
			},
			{
				id: "/profile",
				pattern: /^\/profile\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/register",
				pattern: /^\/register\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
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
