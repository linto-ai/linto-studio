const { isGenericSpeakerName } = require(
  `${process.cwd()}/lib/utility/isGenericSpeakerName`,
)

/**
 * Flag a live caption (websocket message or stored caption) with
 * `locutorDefined`: false when its locutor is a generated placeholder
 * ("Guest-1", "spk_0"...), true for a real name. Set only when the caption
 * carries a non-empty locutor. Mutates and returns the caption.
 * @param {object} caption
 * @returns {object}
 */
function annotateLocutorDefined(caption) {
  if (
    caption &&
    typeof caption === "object" &&
    typeof caption.locutor === "string" &&
    caption.locutor !== ""
  ) {
    caption.locutorDefined = !isGenericSpeakerName(caption.locutor)
  }
  return caption
}

module.exports = { annotateLocutorDefined }
