import test from "ava"
import { computeIsNeverGenerated } from "../computeIsNeverGenerated.js"

const neverGenerated = {
  jobsLoaded: true,
  entry: { jobId: null },
  status: "idle",
}

test("computeIsNeverGenerated() is true for a known service without a job", (t) => {
  t.true(computeIsNeverGenerated(neverGenerated))
})

test("computeIsNeverGenerated() is false while the job list is unknown", (t) => {
  t.false(computeIsNeverGenerated({ ...neverGenerated, jobsLoaded: false }))
})

test("computeIsNeverGenerated() is false for an unregistered service", (t) => {
  t.false(computeIsNeverGenerated({ ...neverGenerated, entry: undefined }))
})

test("computeIsNeverGenerated() is false when a job exists", (t) => {
  t.false(
    computeIsNeverGenerated({ ...neverGenerated, entry: { jobId: "j1" } }),
  )
})

test("computeIsNeverGenerated() is false once a generation is requested, running, done or failed", (t) => {
  for (const status of ["queued", "processing", "complete", "error"]) {
    t.false(computeIsNeverGenerated({ ...neverGenerated, status }), status)
  }
})
