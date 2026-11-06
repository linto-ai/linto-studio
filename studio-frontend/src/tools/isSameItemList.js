/**
 * Whether two lists hold the same items in the same order, compared by their
 * id (or value). A parent often rebuilds its list on every change: a new
 * array of equal items is still the same list.
 *
 * @param {Array<{id?: *, value?: *}>} items
 * @param {Array<{id?: *, value?: *}>} otherItems
 * @returns {boolean}
 */
export function isSameItemList(items, otherItems) {
  if (!Array.isArray(items) || !Array.isArray(otherItems)) return false
  if (items.length !== otherItems.length) return false
  return items.every(
    (item, index) => computeItemKey(item) === computeItemKey(otherItems[index]),
  )
}

function computeItemKey(item) {
  return item?.id ?? item?.value
}
