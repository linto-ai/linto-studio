import DEFAULTENV from "../const/defaultEnv"
import getCurrentTheme from "./getCurrentTheme"

export function getEnv(envKey) {
  const themeEnv = getCurrentTheme()?.defaultEnvValues || {}
  return process.env[envKey] || themeEnv[envKey] || DEFAULTENV[envKey]
}
