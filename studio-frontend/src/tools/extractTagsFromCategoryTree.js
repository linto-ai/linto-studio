export function extractTagsFromCategoryTree(tree) {
  const tags = []
  for (const category of tree) {
    for (const tag of category.tags) {
      tags.push({
        ...tag,
        color: category.color,
        categoryName: category.name,
        type: category.type,
      })
    }
  }
  return tags
}
