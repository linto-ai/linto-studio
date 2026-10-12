export default async function bulkRequest(
  requestFunction,
  requestParams,
  callback,
) {
  for (let i = 0; i < requestParams.length; i++) {
    try {
      let req = await requestFunction.apply(null, requestParams[i])
      if (req.status === "error") {
        return req
      }
    } catch (error) {
      console.error("bulkRequest error", error)
      return { status: "error", error: error }
    }
    callback(i)
  }
  return { status: "success" }
}
