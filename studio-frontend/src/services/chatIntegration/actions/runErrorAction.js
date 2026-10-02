// The action button of an error card (see showErrorReply).
export function runErrorAction(chatIntegration, messageId, actionId) {
  const payload = chatIntegration.errorActionPayloads.get(messageId) ?? null
  switch (actionId) {
    case "upgrade":
      // payload: the SaaS refusal body
      chatIntegration.openUpgradeModal(payload)
      break
    default:
      console.error("[chat] unknown error action", actionId)
  }
}
