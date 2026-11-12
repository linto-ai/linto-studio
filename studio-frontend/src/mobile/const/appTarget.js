// The mobile front is built twice: for the web (served by the instance under
// /m/, installable as a PWA) and embedded in the native app (Capacitor,
// served from the app's own root by `npm run build:app`, mode "app").
export const IS_NATIVE_APP = import.meta.env.MODE === "app"

// Path the mobile router and full-page navigations live under.
export const MOBILE_BASE = IS_NATIVE_APP ? "/" : "/m/"
