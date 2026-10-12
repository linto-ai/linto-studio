/**
 * Classifie un turn websocket.
 * Avec diarisation, un même segment arrive 2 fois :
 *   - "original" : avec locutor
 *   - "translation" : sans locutor, avec translations remplies
 *
 * @param {Object} turn
 * @param {boolean} hasDiarization
 * @returns {"original"|"translation"|"bot"}
 */
export default function classifySessionTurn(turn, hasDiarization) {
  if (turn?.locutor === "bot") return "bot"
  if (!hasDiarization) return "original"

  const isTranslationTurn =
    turn.translations && Object.values(turn.translations).some((v) => v)

  return isTranslationTurn && !turn.locutor ? "translation" : "original"
}
