// Form values -> POST /cloud/admin/orgs/:id/plan body. Seats below 1 and an
// empty date are left out (the API applies the plan floor and an open end);
// a date input value (YYYY-MM-DD) becomes the end of that day, UTC.
export function buildManualPlanPayload(values) {
  const payload = { planKey: values.planKey }
  const seats = Math.floor(Number(values.seats))
  if (seats >= 1) payload.seats = seats
  const until = (values.until ?? "").trim()
  if (until) payload.until = new Date(`${until}T23:59:59.999Z`).toISOString()
  const reason = (values.reason ?? "").trim()
  if (reason) payload.reason = reason
  return payload
}
