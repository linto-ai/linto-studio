import { parseSeatCount } from "./parseSeatCount.js"

// Form values -> POST /cloud/admin/orgs/:id/mode body. seatsMax only for a
// managed org: a count, or null (empty field) to lift the cap. Also normalizes
// the loaded billing, so a form and its org compare on the same shape.
export function buildOrgModePayload(values) {
  const payload = { mode: values.mode }
  if (values.mode === "managed")
    payload.seatsMax = parseSeatCount(values.seatsMax)
  return payload
}
