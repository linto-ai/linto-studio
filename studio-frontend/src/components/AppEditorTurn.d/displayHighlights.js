import { nextTick } from "vue"
import findExpressionInWordsList from "@/tools/findExpressionInWordsList.js"
import getWordsRangeFromTagMetadata from "../../tools/getWordsRangeFromTagMetadata"

export default async function displayHighlights() {
  // first unhighlight all
  await nextTick()
  await this.unHighlightAllText()

  this.highlightsRanges = {}
  // then highlight all
  for (let hightlightCat of this.hightlightsCategories) {
    let { tagsWithoutRangeMetadata, rangesFromMetadata } = divideTags(
      hightlightCat.tags
    )

    let rangesFromText = findExpressionInWordsList(
      tagsWithoutRangeMetadata,
      this.words,
      (k) => k.name,
      (w) => w.word
    )

    let domRanges = rangesFromText
      .map(this.plainRangeToDomRange)
      .concat(rangesFromMetadata.map(metadataRangeToDomRange)) //save it to don't compute it again

    this.highlightsRanges[hightlightCat._id] = {
      ranges: domRanges,
      category: hightlightCat,
    }
  }

  await this.hightlightAllText()
}

function divideTags(tags) {
  let tagsWithRangeMetadata = []
  let tagsWithoutRangeMetadata = []
  let rangesFromMetadata = []
  for (let tag of tags) {
    let ranges = getWordsRangeFromTagMetadata(tag)
    if (ranges.length > 0) {
      tagsWithRangeMetadata.push(tag)
      rangesFromMetadata = rangesFromMetadata.concat(
        ranges.map((r) => ({ ...r, tag }))
      )
    } else {
      tagsWithoutRangeMetadata.push(tag)
    }
  }
  return { tagsWithoutRangeMetadata, rangesFromMetadata }
}

function metadataRangeToDomRange(range) {
  const domRange = new Range()
  domRange.setStartBefore(document.getElementById(range.startId))
  domRange.setEndAfter(document.getElementById(range.endId))
  domRange._tag = range.tag
  return domRange
}
