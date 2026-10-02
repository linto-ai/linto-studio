import { computeSaasRefusal } from "./computeSaasRefusal.js"

// Refusals a plan change lifts: an admin is offered the upgrade, anyone else
// is told to ask one. The others (unverified email, unknown) have no upgrade.
// A spent quota is one too, with its own wording (computeQuotaError).
const UPGRADABLE_REASONS = ["feature_disabled", "team_plan_required"]

/**
 * The error card the chat shows when its reply failed: a SaaS refusal (plan
 * limit, feature not in the plan, unverified email…) or a generic failure.
 * @param {{ status: number|null, data: object|null }|null} error - as passed
 *   to apiSendChatMessage's onError
 * @param {object} context
 * @param {boolean} context.isAdmin - the user administers the org
 * @returns {{
 *   titleKey: string,
 *   messages: Array<{ key: string, params?: object }>,
 *   action: "upgrade"|null
 * }} i18n keys for the title and the description (messages, in order)
 */
export function computeChatReplyError(error, { isAdmin }) {
  // canBuyPlan only refines file import refusals, never a chat one
  const refusal = computeSaasRefusal(error?.data, {
    isAdmin,
    canBuyPlan: false,
  })
  if (!refusal) {
    return {
      titleKey: "chat.errors.reply_failed_title",
      messages: [{ key: "chat.errors.reply_failed" }],
      action: null,
    }
  }
  if (error.data.reason === "quota_exceeded") {
    return computeQuotaError(isAdmin)
  }
  const titleKey = "chat.errors.refused_title"
  if (!UPGRADABLE_REASONS.includes(error.data.reason)) {
    return { titleKey, messages: refusal.messages, action: null }
  }
  if (isAdmin) {
    return { titleKey, messages: refusal.messages, action: "upgrade" }
  }
  return {
    titleKey,
    messages: [...refusal.messages, { key: "billing.refusal.contact_admin" }],
    action: null,
  }
}

// The limit is the title; the description says what it blocks and the way
// out, which only an admin can take.
function computeQuotaError(isAdmin) {
  if (isAdmin) {
    return {
      titleKey: "billing.limit_reached",
      messages: [{ key: "chat.errors.quota_exceeded_admin" }],
      action: "upgrade",
    }
  }
  return {
    titleKey: "billing.limit_reached",
    messages: [{ key: "chat.errors.quota_exceeded_member" }],
    action: null,
  }
}
