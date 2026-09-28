import { formatMinutesDuration } from "./formatMinutesDuration.js"
import { isSaasRefusal } from "./isSaasRefusal.js"

/**
 * What a form shows when the SaaS refuses its request (402/403 body of
 * studio-api: { code, reason, capability, remaining, topUp }): the messages
 * and the one call to action that can lift the refusal. The reason decides:
 * the capability only refines it (a fail-closed internal error carries the
 * capability too, and must never read as "buy more"). Buying a pack or a
 * plan is the org admin's job: anyone else is told to contact one.
 * @param {object|null} errorData - response body of the refused request
 * @param {object} context
 * @param {boolean} context.isAdmin - the user administers the org
 * @param {boolean} context.canBuyPlan - a plan would lift a quota (free personal org)
 * @param {string} [context.fileName] - the refused file, for an import refusal
 * @param {string} [context.importResetLabel] - formatted date the file quota resets
 * @returns {{ messages: Array<{ key: string, params: object }>, action: "buy_pack"|"plans"|"contact_admin"|null } | null}
 *   null when the error is not a SaaS refusal
 */
export function computeSaasRefusal(errorData, context) {
  if (!isSaasRefusal(errorData)) return null
  const { messages, action } = computeRefusalContent(errorData, context)
  if (action && !context.isAdmin) {
    return {
      messages: [...messages, { key: "billing.refusal.contact_admin" }],
      action: "contact_admin",
    }
  }
  return { messages, action }
}

function computeRefusalContent(errorData, context) {
  switch (errorData.reason) {
    case "email_not_verified":
      return message("billing.refusal.email_not_verified")
    case "team_plan_required":
      return message("billing.team_plan_required")
    case "feature_disabled":
      return message("billing.refusal.not_available")
    case "credit_exhausted":
      return message("billing.refusal.live_credit", {}, "buy_pack")
    case "quota_exceeded":
      return errorData.capability === "import.minutes"
        ? computeImportRefusal(errorData, context)
        : message("billing.limit_reached")
    default:
      return message("billing.refusal.unknown")
  }
}

// remaining counts the transcription pack too: from a minute left on, the
// file is just longer than what is left. With nothing to buy (a paid plan
// has no pack and no higher self-serve plan), the reset date is the way out.
function computeImportRefusal({ remaining, topUp }, context) {
  const summary = computeImportSummary(remaining, context.fileName)
  if (topUp) return { messages: [summary], action: "buy_pack" }
  if (context.canBuyPlan) return { messages: [summary], action: "plans" }
  if (!context.importResetLabel) return { messages: [summary], action: null }
  return {
    messages: [
      summary,
      {
        key: "billing.refusal.import_reset",
        params: { date: context.importResetLabel },
      },
    ],
    action: null,
  }
}

function computeImportSummary(remaining, fileName) {
  const minutesLeft = Math.round(remaining || 0)
  if (minutesLeft < 1) return { key: "billing.refusal.import_exhausted" }
  const left = formatMinutesDuration(minutesLeft)
  if (!fileName) {
    return {
      key: "billing.refusal.import_too_long",
      params: { remaining: left },
    }
  }
  return {
    key: "billing.refusal.import_file_too_long",
    params: { remaining: left, name: fileName },
  }
}

function message(key, params = {}, action = null) {
  return { messages: [{ key, params }], action }
}
