import { nextTick } from "vue"

export default async function unHighlightAllText() {
  await nextTick()
  Object.keys(this.highlightsRanges).forEach((categoryId) => {
    if (!this.highlightsRanges[categoryId]) return
    if (!this.highlightsRanges[categoryId].ranges) return
    try {
      this.highlightsRanges[categoryId].ranges.forEach((range) => {
        this.unhighlightRange({
          ...this.highlightsRanges[categoryId],
          range,
        })
      })
    } catch (e) {
      this.debug("Error while unhighlighting", this.turnId)
    }
  })
}
