function toObjectIds(ids, getObjectId) {
  return ids.map((id) => (typeof id === "string" ? getObjectId(id) : id))
}

module.exports = {
  toObjectIds,
}
