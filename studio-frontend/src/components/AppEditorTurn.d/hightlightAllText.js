import { nextTick } from "vue"

export default async function hightLightAllText() {
  await nextTick()
  Object.keys(this.highlightsRanges).forEach((categoryId) => {
    if (!this.hightlightsCategoriesVisibility[categoryId]) return

    if (!this.highlightsRanges[categoryId]) return
    if (!this.highlightsRanges[categoryId].ranges) return

    this.highlightsRanges[categoryId].ranges.forEach(async (range) => {
      await this.highlightRange({ ...this.highlightsRanges[categoryId], range })
    })
  })
}
