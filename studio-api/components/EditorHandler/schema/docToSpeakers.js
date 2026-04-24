/**
 * Extract speakers from a Y.Doc's "speakers" Y.Map in MongoDB format.
 *
 * @param {import("yjs").Doc} ydoc
 * @returns {Array<{speaker_id: string, speaker_name: string}>}
 */
function docToSpeakers(ydoc) {
  const yMap = ydoc.getMap("speakers")
  return [...yMap.entries()].map(([speaker_id, data]) => ({
    speaker_id,
    speaker_name: (data && data.name) || "",
  }))
}

module.exports = { docToSpeakers }
