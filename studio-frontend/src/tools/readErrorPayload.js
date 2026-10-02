// Error bodies of blob requests arrive as a Blob: read a JSON one back so the
// caller sees the API error code. Anything else is returned as is.
export async function readErrorPayload(data) {
  if (typeof Blob === "undefined" || !(data instanceof Blob)) return data
  if (!data.type.includes("json")) return data
  try {
    return JSON.parse(await data.text())
  } catch (error) {
    return data
  }
}
