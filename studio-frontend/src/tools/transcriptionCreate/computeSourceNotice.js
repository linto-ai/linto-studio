import { formatMinutesDuration } from "../formatMinutesDuration.js"

const IMPORT_CAPABILITY = "import.minutes"
const CONTACT_ADMIN_MESSAGE = { key: "billing.refusal.contact_admin" }

/**
 * The one message of the first step about what limits the transcription, and
 * what can lift it.
 * @param {object} params
 * @param {string} params.source - draft.source
 * @param {{ name: string, disabled: boolean }[]} params.timingOptions - see computeTimingOptions
 * @param {{ messages: object[], action: string|null }|null} params.refusal
 *   what the server refused or would refuse, see computeSaasRefusal. For a
 *   recording that wasn't refused, it means no post-recording minute is left.
 * @param {string} [params.refusedCapability] - capability of that refusal
 * @param {boolean} params.isServerRefusal - the server did refuse the request
 * @param {boolean} params.isLiveCreditExhausted
 * @param {boolean} params.canBuyLivePack
 * @param {{ count: number, minutes: number, isPartial: boolean, remaining: number }|null} [params.filesOverCredit]
 *   the files need more minutes than what is left, some being left
 * @returns {{ messages: object[], action: string|null, packKind: string|null, blocksContinue: boolean }|null}
 *   action: "buy_pack" | "plans" | "contact_admin" | null
 */
export function computeSourceNotice(params) {
  const { source, refusal, isServerRefusal } = params
  if (source === "session") return null
  if (isServerRefusal) return computeRefusalNotice(params)
  if (source !== "file" || !refusal) return computeAvailabilityNotice(params)
  const notice = computeRefusalNotice(params)
  return params.filesOverCredit
    ? {
        ...notice,
        messages: [
          computeFilesOverCreditMessage(params.filesOverCredit),
          ...notice.messages.slice(1),
        ],
      }
    : notice
}

function computeFilesOverCreditMessage({
  count,
  minutes,
  isPartial,
  remaining,
}) {
  const key = computeFilesOverCreditKey(count, isPartial)
  return {
    key: `transcription_create.credit.${key}`,
    params: {
      count,
      duration: formatMinutesDuration(minutes),
      remaining: formatMinutesDuration(remaining),
    },
  }
}

function computeFilesOverCreditKey(count, isPartial) {
  if (count === 1) return "file_over_credit"
  return isPartial ? "files_over_credit_partial" : "files_over_credit"
}

function computeRefusalNotice({ refusal, refusedCapability }) {
  return {
    messages: refusal.messages,
    action: refusal.action,
    packKind:
      refusedCapability === IMPORT_CAPABILITY ? "transcription" : "live",
    blocksContinue: true,
  }
}

function computeAvailabilityNotice(params) {
  const { source, refusal, timingOptions, isLiveCreditExhausted } = params
  if (source !== "file" && isLiveCreditExhausted) {
    return refusal
      ? computeNoMinuteNotice(params)
      : computeLiveExhaustedNotice(params)
  }
  if (source !== "file" && refusal) {
    return {
      messages: [
        { key: "transcription_create.credit.post_recording_exhausted" },
        ...refusal.messages.slice(1),
      ],
      action: refusal.action,
      packKind: "transcription",
      blocksContinue: false,
    }
  }
  if (!canTranscribe(source, timingOptions)) return NO_ENGINE_NOTICE
  if (source !== "file" && isTimingDisabled(timingOptions, "live")) {
    return LIVE_UNAVAILABLE_NOTICE
  }
  return null
}

// No plan to offer here: minutes of any kind can only be bought as packs.
function computeNoMinuteNotice({ canBuyLivePack }) {
  return {
    messages: withAdminContact(
      { key: "transcription_create.credit.both_exhausted" },
      canBuyLivePack,
    ),
    action: canBuyLivePack ? "buy_pack" : null,
    packKind: null,
    blocksContinue: true,
  }
}

function computeLiveExhaustedNotice({ canBuyLivePack }) {
  return {
    messages: withAdminContact(
      { key: "transcription_create.credit.live_exhausted" },
      canBuyLivePack,
    ),
    action: canBuyLivePack ? "buy_pack" : null,
    packKind: "live",
    blocksContinue: false,
  }
}

function withAdminContact(message, canBuy) {
  return canBuy ? [message] : [message, CONTACT_ADMIN_MESSAGE]
}

function canTranscribe(source, timingOptions) {
  return source === "file"
    ? !isTimingDisabled(timingOptions, "offline")
    : timingOptions.some((option) => !option.disabled)
}

function isTimingDisabled(timingOptions, name) {
  return timingOptions.some((option) => option.name === name && option.disabled)
}

const NO_ENGINE_NOTICE = {
  messages: [{ key: "conversation.transcription.no_model_for_level" }],
  action: null,
  packKind: null,
  blocksContinue: true,
}

const LIVE_UNAVAILABLE_NOTICE = {
  messages: [{ key: "transcription_create.credit.live_unavailable" }],
  action: null,
  packKind: null,
  blocksContinue: false,
}
