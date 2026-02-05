import DEFAULTENV from "../const/defaultEnv"
import getCurrentTheme from "./getCurrentTheme"

/**
 * Get configuration value with fallback chain:
 * 1. window.VUE_APP_CONFIG (runtime injection in Docker)
 * 2. import.meta.env (build-time, Vite)
 * 3. Theme defaults
 * 4. Hardcoded defaults
 */
export function getEnv(envKey) {
  const vueEnvKey = envKey.startsWith("VUE_APP_") ? envKey : `VUE_APP_${envKey}`

  // Runtime config (Docker)
  if (
    typeof window !== "undefined" &&
    window.VUE_APP_CONFIG?.[vueEnvKey] !== undefined
  ) {
    return window.VUE_APP_CONFIG[vueEnvKey]
  }

  // Build-time env (Vite injects VUE_APP_* via import.meta.env)
  if (import.meta.env[vueEnvKey] !== undefined) {
    return import.meta.env[vueEnvKey]
  }

  // Theme defaults
  const themeEnv = getCurrentTheme()?.defaultEnvValues || {}
  if (themeEnv[vueEnvKey] !== undefined) {
    return themeEnv[vueEnvKey]
  }

  // Hardcoded defaults
  return DEFAULTENV[vueEnvKey]
}
