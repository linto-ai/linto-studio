/**
 * Seat capacity of a per-seat plan: how many seats the collaborators take and
 * how many are left. A null capacity means the plan has no seat cap, in which
 * case nothing is ever full and no figure is available to display.
 * @param {number} seatHolderCount - members holding a collaborator role
 * @param {number|null} capacity - seats bought on the subscription
 * @returns {{used: number, capacity: number|null, available: number|null, isFull: boolean}}
 */
export function computeSeatSummary(seatHolderCount, capacity) {
  const used = Math.max(0, seatHolderCount || 0)
  if (capacity == null) {
    return { used, capacity: null, available: null, isFull: false }
  }
  const total = Math.max(0, capacity)
  return {
    used,
    capacity: total,
    available: Math.max(0, total - used),
    isFull: used >= total,
  }
}
