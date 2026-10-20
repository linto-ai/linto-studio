// Leaves the app for an external page (e.g. Stripe). Resolves when the
// browser "back" button restores this page from the back-forward cache: the
// state set before leaving (loading flags) comes back as is and must be reset.
export function leavePageFor(url) {
  return new Promise((resolve) => {
    window.addEventListener("pageshow", function onPageShow(event) {
      if (!event.persisted) return
      window.removeEventListener("pageshow", onPageShow)
      resolve()
    })
    window.location.assign(url)
  })
}
