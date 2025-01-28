

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.DTkVH-b9.js","_app/immutable/chunks/disclose-version.I8z8isMk.js","_app/immutable/chunks/runtime.YJoNIFdn.js"];
export const stylesheets = ["_app/immutable/assets/0.BSNVmhO_.css"];
export const fonts = [];
