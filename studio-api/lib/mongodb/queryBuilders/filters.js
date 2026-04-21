function applyNameTextSearch(query, filter) {
  const searchConditions = []
  if (filter?.name) {
    searchConditions.push({
      name: { $regex: filter.name, $options: "i" },
    })
  }
  if (filter?.text) {
    searchConditions.push({
      "text.raw_segment": { $regex: filter.text, $options: "i" },
    })
  }
  if (searchConditions.length > 0) {
    query.$and = [{ $or: searchConditions }]
  }
}

function applyTagAllFilter(query, filter) {
  if (filter?.tags) {
    query.tags = {
      $all: filter.tags.split(","),
    }
  }
}

module.exports = {
  applyNameTextSearch,
  applyTagAllFilter,
}
