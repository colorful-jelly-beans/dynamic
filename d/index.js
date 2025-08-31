export * from "./dom/content.js"
export * from "./dom/elements.js"
export * from "./dom/options.js"

export * from "./reactivity/globals.js";
export * from "./reactivity/reactives.js";
export * from "./reactivity/watchers.js";

export * from "./router/index.js"

export * from "./style/index.js"

// accessible without import

import { mounter } from "./dom/elements.js"
import { e } from "./dom/elements.js"

window.mounter = mounter
window.e = e