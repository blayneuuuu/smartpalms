export const index = 5;
let component_cache;
export const component = async () =>
  (component_cache ??= (
    await import("../entries/pages/register/_page.svelte.js")
  ).default);
export const imports = [
  "_app/immutable/nodes/5.ubTz6F6L.js",
  "_app/immutable/chunks/disclose-version.CkmQrO1S.js",
  "_app/immutable/chunks/index-client.CvPjOW-w.js",
  "_app/immutable/chunks/legacy.4sU8tFht.js",
  "_app/immutable/chunks/action.BQOkHxEW.js",
  "_app/immutable/chunks/actions.ChP2t6HX.js",
  "_app/immutable/chunks/props.HYy-qROY.js",
  "_app/immutable/chunks/chunk-5JJNUDZC.BecKB5YT.js",
  "_app/immutable/chunks/entry.C-GEGAjY.js",
  "_app/immutable/chunks/index.CU3wpBA0.js",
];
export const stylesheets = [];
export const fonts = [];
