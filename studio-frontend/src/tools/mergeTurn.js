import { v4 as uuid } from "uuid"

export function mergeTurn(startTurn, endTurn) {
  const words = [...startTurn.words, ...endTurn.words]

  const startTurnDuration =
    startTurn.words[startTurn.words.length - 1].etime - startTurn.words[0].stime
  const endTurnDuration =
    endTurn.words[endTurn.words.length - 1].etime - endTurn.words[0].etime

  // Keep informations of the turn with the biggest duration
  if (startTurnDuration >= endTurnDuration) {
    return {
      ...startTurn,
      words,
      segment: `${startTurn.segment} ${endTurn.segment}`,
      turn_id: generateID(),
    }
  } else {
    return {
      ...endTurn,
      words,
      segment: `${startTurn.segment} ${endTurn.segment}`,
      turn_id: generateID(),
    }
  }
}

function generateID() {
  return process.env["TEST"] ? "id" : uuidv4()
}
