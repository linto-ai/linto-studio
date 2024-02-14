import test from "ava"

import filterTagsOnCategoryList from "../filterTagsOnCategoryList.js"

test("filterTagsOnCategoryList", (t) => {
  const categoryList = [
    {
      color: "#FF0000",
      tags: [{ name: "foo" }, { name: "bar" }],
    },
    {
      color: "#00FF00",
      tags: [{ name: "arobase" }, { name: "def" }],
    },
  ]
  const search = "o"
  const result = filterTagsOnCategoryList(categoryList, search)
  t.deepEqual(result, [
    {
      color: "#FF0000",
      tags: [{ name: "foo" }],
    },
    {
      color: "#00FF00",
      tags: [{ name: "arobase" }],
    },
  ])
})
