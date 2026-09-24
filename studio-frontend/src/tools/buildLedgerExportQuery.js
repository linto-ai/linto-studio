// Date inputs (YYYY-MM-DD) -> GET /cloud/admin/ledger.csv bounds. An empty
// date is left out; the end bound covers the whole chosen day, UTC.
export function buildLedgerExportQuery(values) {
  const query = {}
  const from = (values.from ?? "").trim()
  if (from) query.from = from
  const to = (values.to ?? "").trim()
  if (to) query.to = new Date(`${to}T23:59:59.999Z`).toISOString()
  return query
}
