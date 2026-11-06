import { clampNumber } from "../clampNumber.js"
import {
  MAX_SPEAKER_COUNT,
  MIN_SPEAKER_COUNT,
} from "../../const/transcriptionCreate.js"

/**
 * Number of speakers to keep from what was typed.
 * @param {string} typed
 * @param {number} previous - kept when what was typed isn't a number
 * @returns {number}
 */
export function computeSpeakerCount(typed, previous) {
  const count = parseInt(typed, 10)
  return Number.isNaN(count)
    ? previous
    : clampNumber(count, MIN_SPEAKER_COUNT, MAX_SPEAKER_COUNT)
}
