const MATERIAL_COLORS = [
  "deep-purple",
  "indigo",
  "blue",
  "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deep-orange",
]

function getRandomColor() {
  return MATERIAL_COLORS[Math.floor(Math.random() * MATERIAL_COLORS.length)]
}

module.exports = {
  async up(db, client) {
    const organizations = await db
      .collection("organizations")
      .find({})
      .toArray()
    for (const organization of organizations) {
      console.log(`Migrating tags for organization ${organization.name}`)
      const categories = await db
        .collection("categories")
        .find({
          scopeId: organization._id.toString(),
        })
        .toArray()

      const systemCategory = categories.find(
        (category) => category.name === "system" && category.type === "system",
      )
      let systemCategoryId = systemCategory?._id
      if (!systemCategory) {
        const insertResult = await db.collection("categories").insertOne({
          name: "system",
          type: "system",
          color: getRandomColor(),
          scopeId: organization._id.toString(),
          created: new Date(),
          last_update: new Date(),
        })
        systemCategoryId = insertResult.insertedId
        console.log(
          `Created system category for organization ${organization.name}`,
        )
      } else {
        console.log(
          `System category already exists for organization ${organization.name}`,
        )
      }

      const tagsCategory = categories.find(
        (category) => category.name === "tags" && category.type === "system",
      )
      let tagsCategoryId = tagsCategory?._id
      if (!tagsCategory) {
        const insertResult = await db.collection("categories").insertOne({
          name: "tags",
          type: "system",
          color: getRandomColor(),
          scopeId: organization._id.toString(),
          parentId: systemCategoryId,
          created: new Date(),
          last_update: new Date(),
        })
        tagsCategoryId = insertResult.insertedId
        console.log(
          `Created tags category for organization ${organization.name}`,
        )
      } else {
        console.log(
          `Tags category already exists for organization ${organization.name}`,
        )
        // update the tags category to be a system category
        await db.collection("categories").updateOne(
          { _id: tagsCategoryId },
          {
            $set: {
              type: "system",
              scopeId: organization._id.toString(),
              parentId: systemCategoryId,
            },
          },
        )
      }

      // For each tags,
      // set the tags.categoryId to the tagsCategoryId
      // set random color to tags.color
      // if a tag was in a previous category, set tags.description = previous category name
      const tags = await db
        .collection("tags")
        .find({
          $or: [
            {
              organizationId: organization._id,
            },
            {
              organizationId: organization._id.toString(),
            },
          ],
        })
        .toArray()
      let memCategories = new Map()

      for (const tag of tags) {
        let previousCategory = memCategories.get(tag.categoryId)
        if (!previousCategory) {
          previousCategory = await db
            .collection("categories")
            .findOne({ _id: tag.categoryId })
        }

        if (previousCategory) {
          memCategories.set(tag.categoryId, previousCategory)
          await db.collection("tags").updateOne(
            { _id: tag._id },
            {
              $set: {
                description: previousCategory.name,
                color: getRandomColor(),
                categoryId: tagsCategoryId,
              },
            },
          )
          console.log(
            `Updated tag ${tag.name} for organization ${organization.name}`,
          )
          console.log(
            `Tag ${tag.name} was in category ${previousCategory.name}`,
          )
        } else {
          await db.collection("tags").updateOne(
            { _id: tag._id },
            {
              $set: {
                description: tag.name,
                color: getRandomColor(),
                categoryId: tagsCategoryId,
              },
            },
          )
          console.log(
            `Updated tag ${tag.name} for organization ${organization.name}`,
          )
        }
      }
    }
  },

  async down(db, client) {},
}
