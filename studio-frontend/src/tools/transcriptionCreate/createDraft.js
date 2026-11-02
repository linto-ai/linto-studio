import { AUTO_LANGUAGE } from "../../const/transcriptionCreate.js"
import { DEFAULT_MEMBERS_RIGHT } from "../../mobile/const/defaultMembersRight.js"

/**
 * The choices of the "new transcription" modal, before any reconciliation
 * with what the organization offers (see reconcileDraft).
 * @param {{ source: string, securityLevel: number }} initialChoices
 *   source: "file" | "microphone" | "visio" | "session"
 * @returns {object} the draft
 *   timing: "live" | "offline" | "both"
 *   languages: [AUTO_LANGUAGE] or bare language codes (["fr", "en"])
 *   speakers.mode: "none" | "distinguish" | "recognize"
 */
export function createDraft({ source, securityLevel }) {
  return {
    source,
    timing: "both",
    securityLevel,
    keepAudio: true,
    languages: [AUTO_LANGUAGE],
    translations: [],
    profileId: null,
    profileChosenByUser: false,
    serviceName: null,
    serviceChosenByUser: false,
    speakers: { mode: "distinguish", collectionId: null },
    speakersChosenByUser: false,
    membersRight: DEFAULT_MEMBERS_RIGHT,
    folderId: null,
    visio: {
      url: "",
      provider: null,
      showSubtitles: true,
      subtitleSource: "original",
    },
  }
}
