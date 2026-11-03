import test from "ava"
import { computeTranscriptionCreateRequest } from "../computeTranscriptionCreateRequest.js"
import { computeTranscriptionCreateReturnUrl } from "../computeTranscriptionCreateReturnUrl.js"

test("consumes the parameter and keeps the rest of the query", (t) => {
  t.deepEqual(
    computeTranscriptionCreateRequest({ new_transcription: "1", page: "2" }),
    { query: { page: "2" } },
  )
})

test("nothing to do without the parameter", (t) => {
  t.is(computeTranscriptionCreateRequest({ page: "2" }), null)
  t.is(computeTranscriptionCreateRequest(undefined), null)
})

test("the return URL asks for the modal, without old checkout parameters", (t) => {
  const url = new URL(
    computeTranscriptionCreateReturnUrl(
      "https://a.b/explore?page=2&type=credits&status=cancel",
    ),
  )
  t.is(url.searchParams.get("new_transcription"), "1")
  t.is(url.searchParams.get("page"), "2")
  t.false(url.searchParams.has("type"))
  t.false(url.searchParams.has("status"))
})

test("a return URL can be consumed in turn", (t) => {
  const url = new URL(computeTranscriptionCreateReturnUrl("https://a.b/x"))
  const request = computeTranscriptionCreateRequest(
    Object.fromEntries(url.searchParams),
  )
  t.deepEqual(request, { query: {} })
})
