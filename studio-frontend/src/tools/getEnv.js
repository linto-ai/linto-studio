import DEFAULTENV from "../const/defaultEnv"
import getCurrentTheme from "./getCurrentTheme"

export function getEnv(envKey) {
  const themeEnv = getCurrentTheme()?.defaultEnvValues || {}
  const vueEnvKey = envKey.startsWith("VUE_APP_") ? envKey : `VUE_APP_${envKey}`
  return themeEnv[envKey] || process.env[vueEnvKey] || DEFAULTENV[envKey]
}
