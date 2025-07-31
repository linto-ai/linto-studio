const debug = require("debug")("linto:migration:1.6.0:tags")
const moment = require("moment")
const model = require(`${process.cwd()}/lib/mongodb/models`)
const MongoDriver = require(`${process.cwd()}/lib/mongodb/driver`)

const TYPE = require(`${process.cwd()}/lib/dao/organization/categoryType`)
const COLOR = require(`${process.cwd()}/lib/dao/organization/color`)

function excludeIds(organizations, scopeIds) {
  const scopeSet = new Set(scopeIds)
  return organizations.filter((id) => !scopeSet.has(id))
}

module.exports = {
  async up(db, client) {
    const categories =
      // We search for categories that have the system tag to remove them from the process list
      (
        await db
          .collection("categories")
          .aggregate([
            {
              $group: {
                _id: "$scopeId",
                hasSystemCategory: {
                  $max: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ["$name", TYPE.default().name] },
                          { $eq: ["$type", TYPE.default().type] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
            {
              $match: {
                hasSystemCategory: 1,
              },
            },
          ])
          .toArray()
      ).map((categorie) => categorie._id)

    const organizations = (
      await db.collection("organizations").find({}).toArray()
    ).map((orga) => orga._id.toString())

    const reduceOrganizations = excludeIds(organizations, categories)
    const migrationDate = moment().format()

    for (const scopeId of reduceOrganizations) {
      const insertResult = await db.collection("categories").insertOne({
        name: "tags",
        type: TYPE.SYSTEM,
        color: COLOR.getRandomColor(),
        scopeId: scopeId,
        created: migrationDate,
        last_update: migrationDate,
      })

      const systemCategoryId = insertResult.insertedId

      const categoriesOrga = await model.categories.getByScope(scopeId)
      const listCategories = categoriesOrga.map((item) => item._id.toString())
      const listCategoriesObject = categoriesOrga.map((item) => item._id)

      const combined = [...listCategories, ...listCategoriesObject]
      const tags = await model.tags.getTagByCategoryList(combined)

      const memCategories = new Map(
        categoriesOrga.map((category) => [category._id.toString(), category]),
      )
      for (const tag of tags) {
        const cachedCategory = memCategories.get(tag.categoryId.toString())
        await model.tags.update({
          _id: tag._id,
          description: cachedCategory ? cachedCategory.name : "",
          color: COLOR.getRandomColor(),
          categoryId: systemCategoryId,
          organizationId: new MongoDriver.constructor.mongoDb.ObjectId(scopeId),
        })
      }
    }
  },

  async down(db, client) {},
}
