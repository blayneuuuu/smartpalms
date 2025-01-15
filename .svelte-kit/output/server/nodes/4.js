import * as server from '../entries/pages/lockers/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/lockers/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/lockers/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.BvFb9mrR.js","_app/immutable/chunks/disclose-version.DAuCITe-.js","_app/immutable/chunks/index-client.A1mlkm1m.js","_app/immutable/chunks/props.BzQReNhN.js","_app/immutable/chunks/label.BzEx-SLr.js","_app/immutable/chunks/legacy.dsZeiwBb.js","_app/immutable/chunks/lifecycle.-p2cOu4R.js","_app/immutable/chunks/actions.Ct5CUpLG.js","_app/immutable/chunks/index.C0GZNb9n.js","_app/immutable/chunks/svelte-component.Ua6OYMEt.js"];
export const stylesheets = [];
export const fonts = [];
