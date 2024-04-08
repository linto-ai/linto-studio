import axios from "axios"
import { bus } from "../main.js"
import { getCookie } from "./getCookie"

export async function sendRequest(url, params, data, notif, headers) {
  // Get authorization token
  const userToken = getCookie("authToken")
  try {
    let req = null
    if (params.method === "get") {
      req = await axios.get(url, {
        ...params,
        params: { ...data, t: Date.now() },
        headers: {
          ...headers,
          Authorization: `Bearer ${userToken}`,
        },
      })
    } else {
      req = await axios(url, {
        ...params,
        data,
        headers: {
          ...headers,
          Authorization: `Bearer ${userToken}`,
        },
      })
    }

    if (req.status >= 200 && req.status < 300) {
      let msg = req.data?.message || req.data?.msg
      if (notif) {
        bus.$emit("app_notif", {
          status: "success",
          message: notif.message || msg,
          timeout: notif.timeout,
          redirect: notif.redirect,
        })
      }
      return { status: "success", data: req.data }
    } else {
      throw req
    }
  } catch (error) {
    if (error.code === "ERR_CANCELED") return
    let errMsg = error?.response?.data?.message || error.code || error.message
    if (notif) {
      bus.$emit("app_notif", {
        status: "error",
        message: errMsg,
        timeout: null,
        redirect: false,
      })
    }
    return { status: "error", error, message: errMsg }
  }
}
