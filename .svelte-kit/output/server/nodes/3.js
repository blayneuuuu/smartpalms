export const index = 3;
let component_cache;
export const component = async () =>
  (component_cache ??= (
    await import("../entries/pages/dashboard/_page.svelte.js")
  ).default);
export const imports = [
  "_app/immutable/nodes/3.BhKdMuNe.js",
  "_app/immutable/chunks/disclose-version.CkmQrO1S.js",
  "_app/immutable/chunks/index-client.CvPjOW-w.js",
  "_app/immutable/chunks/props.HYy-qROY.js",
  "_app/immutable/chunks/legacy.4sU8tFht.js",
  "_app/immutable/chunks/lifecycle.DnaYePt7.js",
  "_app/immutable/chunks/chunk-5JJNUDZC.BecKB5YT.js",
  "_app/immutable/chunks/entry.C-GEGAjY.js",
  "_app/immutable/chunks/index.CU3wpBA0.js",
  "_app/immutable/chunks/button.DPkN0eB5.js",
  "_app/immutable/chunks/actions.ChP2t6HX.js",
];
export const stylesheets = [];
export const fonts = [];
