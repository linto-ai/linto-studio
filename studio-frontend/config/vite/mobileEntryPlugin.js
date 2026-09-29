// Serves mobile.html for every /m/* navigation in `vite dev` and
// `vite preview`, the way nginx does in production (config/nginx/nginx.conf).
// Asset requests (anything with a file extension) are left untouched.
function isMobileNavigation(url) {
  const path = url.split("?")[0]
  const underMobilePrefix = path === "/m" || path.startsWith("/m/")
  const isAsset = path.includes(".")
  return underMobilePrefix && !isAsset
}

function rewriteToMobileEntry(request, response, next) {
  if (isMobileNavigation(request.url)) {
    request.url = "/mobile.html"
  }
  next()
}

export function mobileEntryPlugin() {
  return {
    name: "linto-mobile-entry",
    configureServer(server) {
      server.middlewares.use(rewriteToMobileEntry)
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewriteToMobileEntry)
    },
  }
}
