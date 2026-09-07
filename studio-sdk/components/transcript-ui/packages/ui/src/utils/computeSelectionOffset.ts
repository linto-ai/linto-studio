import { computeTextOffsetInContainer } from "./computeTextOffsetInContainer"
import { getSelectionFocus } from "./shadowAwareSelection"

/** Character offset of the current selection focus inside `container`'s plain
 *  text, or null when the selection lives elsewhere. */
export function computeSelectionOffset(container: HTMLElement): number | null {
  const focus = getSelectionFocus(container)
  if (!focus || !container.contains(focus.node)) return null
  return computeTextOffsetInContainer(container, focus.node, focus.offset)
}
