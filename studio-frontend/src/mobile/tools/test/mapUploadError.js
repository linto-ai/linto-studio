import test from "ava"
import { mapUploadError } from "../mapUploadError.js"

test("mapUploadError() keeps the server limit for oversized files", (t) => {
  const error = mapUploadError(
    { errorCode: "FILE_TOO_LARGE", errorData: { maxSize: "500MB" } },
    true,
  )
  t.deepEqual(error, {
    code: "file_too_large",
    retryable: false,
    maxSize: "500MB",
  })
})

test("mapUploadError() marks other server codes as final", (t) => {
  t.deepEqual(mapUploadError({ errorCode: "QUOTA_EXCEEDED" }, true), {
    code: "rejected",
    retryable: false,
  })
})

test("mapUploadError() retries network failures", (t) => {
  t.deepEqual(mapUploadError({}, false), { code: "offline", retryable: true })
  t.deepEqual(mapUploadError({}, true), { code: "network", retryable: true })
})
