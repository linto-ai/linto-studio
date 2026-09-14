const OPT_OUT_COOKIE = "mobile_optout"

// Marks this browser session as "wants the full Studio" and leaves for the
// classic app. redirect.js reads the same cookie to stop sending phones to
// /m/. Session cookie on purpose: closing the browser forgets it, so a phone
// never stays stuck on the classic login page.
export function optOutOfMobileApp() {
  document.cookie = `${OPT_OUT_COOKIE}=1;path=/;SameSite=Lax`
  window.location.href = "/"
}
