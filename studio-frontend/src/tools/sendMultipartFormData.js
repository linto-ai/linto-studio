import { sendRequest } from "./sendRequest.js"

export async function sendMultipartFormData(url, method, data, notif) {
  return sendRequest(url, { method }, data, notif, {
    charset: "utf-8",
    "Content-Type": "multipart/form-data",
  })
}
