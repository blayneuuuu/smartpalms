import * as server from '../entries/pages/profile/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/profile/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.DahBN6IX.js","_app/immutable/chunks/disclose-version.T6rPbwlf.js","_app/immutable/chunks/runtime.D1Gg6DO2.js","_app/immutable/chunks/legacy.Dawxrsww.js","_app/immutable/chunks/render.5P34H023.js","_app/immutable/chunks/props.CI-ns3SY.js","_app/immutable/chunks/Input.Dsvr9uOF.js","_app/immutable/chunks/index-client.XLq-70Ev.js","_app/immutable/chunks/forms.r7BMjKyA.js","_app/immutable/chunks/entry.DSAGDIFt.js"];
export const stylesheets = [];
export const fonts = [];
