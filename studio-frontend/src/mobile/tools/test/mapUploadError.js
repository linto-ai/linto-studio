import test from "ava"
import { mapUploadError } from "../mapUploadError.js"

test("mapUploadError() keeps the server limit for oversized files", (t) => {
  const error = mapUploadError(
    {
      errorCode: "FILE_TOO_LARGE",
      errorData: { maxSize: "500MB" },
      httpStatus: 413,
    },
    true,
  )
  t.deepEqual(error, {
    code: "file_too_large",
    retryable: false,
    maxSize: "500MB",
  })
})

test("mapUploadError() tells a spent quota apart from other refusals", (t) => {
  t.deepEqual(
    mapUploadError({ errorCode: "SAAS_QUOTA_EXCEEDED", httpStatus: 402 }, true),
    { code: "quota", retryable: false },
  )
})

test("mapUploadError() marks other server codes as final", (t) => {
  t.deepEqual(
    mapUploadError({ errorCode: "SAAS_FEATURE_LOCKED", httpStatus: 403 }, true),
    { code: "rejected", retryable: false },
  )
})

test("mapUploadError() marks server answers without code as final", (t) => {
  for (const httpStatus of [400, 403, 404, 500]) {
    t.deepEqual(mapUploadError({ httpStatus }, true), {
      code: "rejected",
      retryable: false,
    })
  }
})

test("mapUploadError() retries transient server answers", (t) => {
  for (const httpStatus of [408, 429, 502, 503, 504]) {
    t.deepEqual(mapUploadError({ httpStatus }, true), {
      code: "network",
      retryable: true,
    })
  }
})

test("mapUploadError() retries network failures", (t) => {
  t.deepEqual(mapUploadError({}, false), { code: "offline", retryable: true })
  t.deepEqual(mapUploadError({}, true), { code: "network", retryable: true })
})
