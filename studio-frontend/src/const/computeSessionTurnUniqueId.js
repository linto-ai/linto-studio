export default function computeSessionTurnUniqueId(turn) {
  return `${turn.astart}::${turn.segmentId}`
}
