

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.DxnAVW5N.js","_app/immutable/chunks/disclose-version.T6rPbwlf.js","_app/immutable/chunks/runtime.D1Gg6DO2.js"];
export const stylesheets = ["_app/immutable/assets/0.Dwbg6CoL.css"];
export const fonts = [];
