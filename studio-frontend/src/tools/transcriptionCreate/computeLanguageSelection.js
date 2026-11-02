import { AUTO_LANGUAGE } from "../../const/transcriptionCreate.js"

/**
 * Next language selection after a toggle in the list: detection and explicit
 * languages exclude each other, and an empty selection falls back to detection.
 * @param {string[]} previous - selection before the toggle
 * @param {string[]} next - selection with the toggled code added or removed
 * @returns {string[]}
 */
export function computeLanguageSelection(previous, next) {
  const justPickedDetection =
    next.includes(AUTO_LANGUAGE) && !previous.includes(AUTO_LANGUAGE)
  if (justPickedDetection) return [AUTO_LANGUAGE]
  const explicit = next.filter((code) => code !== AUTO_LANGUAGE)
  return explicit.length > 0 ? explicit : [AUTO_LANGUAGE]
}
