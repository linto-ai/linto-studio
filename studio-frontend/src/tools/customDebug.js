import Debug from "debug"
import { getEnv } from "./getEnv"

export function customDebug(name) {
  if (getEnv("VUE_APP_SIMPLIFY_LOG") === "true") {
    return function (formatter, ...args) {
      console.log("---" + name + "--->")
      console.log(formatter)
      args.forEach((arg, index) => {
        console.log(JSON.stringify(arg))
      })
      console.log("<---------------")
    }
  } else {
    return Debug(name)
  }
}
