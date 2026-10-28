import { sendRequest } from "./sendRequest.js"

export async function sendMultipartFormData(
  url,
  method,
  data,
  notif,
  onUploadProgress = null,
  signal = null,
) {
  return sendRequest(url, { method, onUploadProgress, signal }, data, notif, {
    charset: "utf-8",
    "Content-Type": "multipart/form-data",
  })
}
