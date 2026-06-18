// Lazily load Stripe.js (v3) from the CDN once, and return a Stripe instance.
// We inject the official script rather than bundling a dependency so the SaaS
// overlay stays opt-in and the open-source build pulls nothing extra. Returns
// null if no publishable key is configured (fake/local mode → no card step).
import { getEnv } from "@/tools/getEnv"

let scriptPromise = null

function loadStripeScript() {
  if (typeof window === "undefined") return Promise.resolve(null)
  if (window.Stripe) return Promise.resolve(window.Stripe)
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src^="https://js.stripe.com/v3"]')
    if (existing) {
      existing.addEventListener("load", () => resolve(window.Stripe))
      existing.addEventListener("error", reject)
      if (window.Stripe) resolve(window.Stripe)
      return
    }
    const s = document.createElement("script")
    s.src = "https://js.stripe.com/v3"
    s.async = true
    s.onload = () => resolve(window.Stripe)
    s.onerror = () => reject(new Error("failed to load Stripe.js"))
    document.head.appendChild(s)
  })
  return scriptPromise
}

// Resolve a configured Stripe instance, or null when no publishable key is set.
export async function getStripe() {
  const pk = getEnv("VUE_APP_STRIPE_PUBLIC_KEY")
  if (!pk) return null
  const Stripe = await loadStripeScript()
  if (!Stripe) return null
  return Stripe(pk)
}

export function hasStripeKey() {
  return !!getEnv("VUE_APP_STRIPE_PUBLIC_KEY")
}
