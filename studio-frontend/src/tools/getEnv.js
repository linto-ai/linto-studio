import DEFAULTENV from "../const/defaultEnv"
import getCurrentTheme from "./getCurrentTheme"

/**
 * Get configuration value with fallback chain:
 * 1. window.VUE_APP_CONFIG (runtime injection in Docker)
 * 2. import.meta.env / process.env (build-time, Vite)
 * 3. Theme defaults
 * 4. Hardcoded defaults
 */
export function getEnv(envKey) {
  const vueEnvKey = envKey.startsWith("VUE_APP_") ? envKey : `VUE_APP_${envKey}`

  // Runtime config (Docker)
  if (typeof window !== 'undefined' && window.VUE_APP_CONFIG?.[vueEnvKey] !== undefined) {
    return window.VUE_APP_CONFIG[vueEnvKey]
  }

  // Build-time env (Vite uses import.meta.env, but we expose via process.env in vite.config.js)
  if (typeof process !== 'undefined' && process.env?.[vueEnvKey] !== undefined) {
    return process.env[vueEnvKey]
  }

  // Theme defaults
  const themeEnv = getCurrentTheme()?.defaultEnvValues || {}
  if (themeEnv[vueEnvKey] !== undefined) {
    return themeEnv[vueEnvKey]
  }

  // Hardcoded defaults
  return DEFAULTENV[vueEnvKey]
}
