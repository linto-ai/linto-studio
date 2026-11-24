// Form values -> mediaRetention of PATCH /organizations/:id. An empty duration
// means no retention: the media are kept.
export function buildMediaRetention(value, unit) {
  const duration = String(value ?? "").trim()
  if (duration === "") return null
  return { value: Number(duration), unit }
}
