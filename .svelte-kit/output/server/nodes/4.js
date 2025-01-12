import * as server from "../entries/pages/lockers/_page.server.ts.js";

export const index = 4;
let component_cache;
export const component = async () =>
  (component_cache ??= (
    await import("../entries/pages/lockers/_page.svelte.js")
  ).default);
export { server };
export const server_id = "src/routes/lockers/+page.server.ts";
export const imports = [
  "_app/immutable/nodes/4.7FMmKhOV.js",
  "_app/immutable/chunks/disclose-version.CkmQrO1S.js",
  "_app/immutable/chunks/index-client.CvPjOW-w.js",
  "_app/immutable/chunks/legacy.4sU8tFht.js",
  "_app/immutable/chunks/props.HYy-qROY.js",
  "_app/immutable/chunks/button.DPkN0eB5.js",
  "_app/immutable/chunks/lifecycle.DnaYePt7.js",
  "_app/immutable/chunks/index.CU3wpBA0.js",
  "_app/immutable/chunks/actions.ChP2t6HX.js",
];
export const stylesheets = ["_app/immutable/assets/4.BtqK5O1U.css"];
export const fonts = [];
