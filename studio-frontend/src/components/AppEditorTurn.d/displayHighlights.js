import { nextTick } from "vue"
import findExpressionInWordsList from "@/tools/findExpressionInWordsList.js"

export default async function displayHighlights() {
  // first unhighlight all
  await nextTick()
  await this.unHighlightAllText()

  this.highlightsRanges = {}
  // then highlight all
  for (let hightlightCat of this.hightlightsCategories) {
    let ranges = findExpressionInWordsList(
      hightlightCat.tags,
      this.words,
      (k) => k.name,
      (w) => w.word
    )

    let domRanges = ranges.map(this.plainRangeToDomRange) //save it to don't compute it again

    this.highlightsRanges[hightlightCat._id] = {
      ranges: domRanges,
      category: hightlightCat,
    }
  }

  await this.hightlightAllText()
}
