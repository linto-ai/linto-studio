import { generateId } from "@/tools/generateId"

const ACTION_ICONS = { upgrade: "sparkles" }

// The assistant answers with an error card: shown in the thread, never
// saved, so reloading the discussion drops it.
// replyError: { titleKey, messages, action } (see computeChatReplyError)
// actionPayload: what runErrorAction needs once the action is clicked
export function showErrorReply(
  chatIntegration,
  { titleKey, messages, action },
  actionPayload = null,
) {
  const { core, t } = chatIntegration
  const id = `error-${generateId()}`
  if (action) chatIntegration.errorActionPayloads.set(id, actionPayload)
  core.chat.streamAbort()
  core.chat.addMessage({
    id,
    role: "assistant",
    content: "",
    createdAt: Date.now(),
    error: {
      title: t(titleKey),
      description: messages.map(({ key, params }) => t(key, params)).join(" "),
      action: action
        ? {
            id: action,
            label: t(`chat.errors.actions.${action}`),
            icon: ACTION_ICONS[action],
          }
        : undefined,
    },
  })
}
