const { callBackoffice } = require("../lib/callStudioApi")

// studio-api answers once every expired media is handled
const TIMEOUT_MS = 10 * 60 * 1000

async function deleteExpiredMedia({ apiUrl, apiKey }) {
  return await callBackoffice(apiUrl, "/conversations/expired", {
    method: "DELETE",
    token: apiKey,
    timeout: TIMEOUT_MS,
  })
}

module.exports = { deleteExpiredMedia }
