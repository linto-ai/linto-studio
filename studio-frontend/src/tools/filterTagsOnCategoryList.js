export default function filterTagsOnCategoryList(categoryList, search) {
  let res = []

  for (let i = 0; i < categoryList.length; i++) {
    let tags = categoryList[i].tags
    let filteredTags = tags.filter((tag) => tag.name.includes(search))
    if (filteredTags.length > 0) {
      res.push({ ...categoryList[i], tags: filteredTags })
    }
  }

  return res
}
