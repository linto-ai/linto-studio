// Instance the native app talks to until the user picks another one.
// `address` is what the user sees and types, `base` is where its API lives
// (found by findInstance: the address itself or its /cm-api).
export const DEFAULT_INSTANCE = Object.freeze({
  address: "https://studio.linto.ai",
  base: "https://studio.linto.ai/cm-api",
})
