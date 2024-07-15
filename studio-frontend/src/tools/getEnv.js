import DEFAULTENV from "../const/defaultEnv"

export function getEnv(envKey) {
  return process.env[envKey] || DEFAULTENV[envKey]
}
